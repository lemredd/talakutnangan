import { PreprocessedRequest, Response } from "!/types/dependent"

import Log from "$!/singletons/log"

import User from "%/models/user"
import Role from "%/models/role"
import AttachedRole from "%/models/attached_role"

import RoleFactory from "~/factories/role"
import UserFactory from "~/factories/user"

import Middleware from "!/bases/middleware"
import URLMaker from "$!/singletons/url_maker"
import Condition from "%/helpers/condition"
import DevController from "!/controllers/dev"

interface OwnArguments {
	hasPreprocessed?: boolean
}

export default class extends DevController {
	get filePath(): string { return __filename }

	async handle(request: PreprocessedRequest<OwnArguments>, response: Response): Promise<void> {
		if (request.nextMiddlewareArguments?.hasPreprocessed) {
			response.status(this.status.OK).json(request.body)
		} else {
			const testUnverifiedEmail = "unverified@example.net"
			const testRole = "test_unverified"

			let testAdminRole = await Role.findOne({
				where: (new Condition()).equal("name", testRole).build()
			})

			if (testAdminRole === null) {
				testAdminRole = await new RoleFactory()
					.name(() => testRole)
					.departmentFlags(0xFFF)
					.roleFlags(0xFFF)
					.semesterFlags(0xFFF)
					.tagFlags(0xFFF)
					.postFlags(0xFFF)
					.commentFlags(0xFFF)
					.profanityFlags(0xFFF)
					.userFlags(0xFFF)
					.auditTrailFlags(0xFFF)
					.insertOne()

				Log.success("controller", "created test unverified role")
			}

			let previousUser = await User.findOne({
				where: (new Condition()).equal("email", testUnverifiedEmail).build()
			})

			if (previousUser === null) {
				const user = await new UserFactory()
					.email(() => testUnverifiedEmail)
					.insertOne()

				Log.success("controller", "created test unverified")

				previousUser = user
			}

			await AttachedRole.upsert({
				userID: previousUser.id,
				roleID: testAdminRole.id
			})

			Log.success("controller", "attached test unverified role to test unverified")

			await previousUser.update({ emailVerifiedAt: null })

			Log.success("controller", "ensured unverified account is not yet verified")

			request.body = {
				email: testUnverifiedEmail,
				password: "password",
				URL: await URLMaker.makeTemporaryURL("/user/verify", {
					id: previousUser.id
				}, 1000 * 45 /* Verification is available for 45 seconds */)
			}

			request.nextMiddlewareArguments = { hasPreprocessed: true }
		}
	}

	get postJobs(): Middleware[] {
		return [
			this
		]
	}
}
