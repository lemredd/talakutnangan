import { PreprocessedRequest, Response } from "!/types/dependent"

import Log from "$!/singletons/log"

import User from "%/models/user"
import Role from "%/models/role"
import AttachedRole from "%/models/attached_role"

import RoleFactory from "~/factories/role"
import UserFactory from "~/factories/user"

import Middleware from "!/bases/middleware"
import Condition from "%/managers/helpers/condition"
import DevController from "!/common_controllers/dev_controller"
import LocalLogInMiddleware from "!/middlewares/authentication/local_log_in"

interface OwnArguments {
	hasPreprocessed?: boolean
}

export default class extends DevController {
	get filePath(): string { return __filename }

	async handle(request: PreprocessedRequest<OwnArguments>, response: Response): Promise<void> {
		if (request.nextMiddlewareArguments?.hasPreprocessed) {
			response.status(this.status.OK).end()
		} else {
			const testAdminEmail = "admin@example.net"
			const testRole = "test_admin"

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

				Log.success("controller", "created test admin role")
			}

			const previousUser = await User.findOne({
				where: (new Condition()).equal("email", testAdminEmail).build()
			})

			if (previousUser === null) {
				const user = await new UserFactory()
					.email(() => testAdminEmail)
					.insertOne()

				Log.success("controller", "created test admin")

				await AttachedRole.build({
					userID: user.id,
					roleID: testAdminRole.id
				})

				Log.success("controller", "attached test admin role to test admin")
			}

			request.body = {
				email: testAdminEmail,
				password: "password"
			}

			request.nextMiddlewareArguments = { hasPreprocessed: true }
		}
	}

	get postJobs(): Middleware[] {
		return [
			new LocalLogInMiddleware(),
			this
		]
	}
}
