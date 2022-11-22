import { readFile } from "fs"
import { promisify } from "util"

import { PreprocessedRequest, Response } from "!/types/dependent"

import Log from "$!/singletons/log"

import User from "%/models/user"
import Role from "%/models/role"
import Signature from "%/models/signature"
import AttachedRole from "%/models/attached_role"

import RoleFactory from "~/factories/role"
import UserFactory from "~/factories/user"
import SignatureFactory from "~/factories/signature"

import Condition from "%/helpers/condition"
import Middleware from "!/bases/middleware"
import DevController from "!/controllers/dev"
import URLMaker from "$!/singletons/url_maker"
import convertTimeToMilliseconds from "$/time/convert_time_to_milliseconds"

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
				"where": new Condition().equal("name", testRole).build()
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
				"where": new Condition().equal("email", testUnverifiedEmail).build()
			})

			if (previousUser === null) {
				const createdUser = await new UserFactory()
				.email(() => testUnverifiedEmail)
				.insertOne()

				Log.success("controller", "created test unverified")

				// eslint-disable-next-line require-atomic-updates
				previousUser = createdUser
			}

			const readAsync = promisify(readFile)
			const previousSignature = await Signature.findOne({
				"where": new Condition().equal("userID", previousUser.id).build()
			})
			Log.success("controller", "making for unverified user's signature")
			if (previousSignature === null) {
				const sampleImagePath = `${this.root}/t/data/logo_bg_transparent.png`
				const sampleImage = await readAsync(sampleImagePath)
				await new SignatureFactory()
				.user(() => Promise.resolve(previousUser as User))
				.fileContents(() => sampleImage)
				.insertOne()

				Log.success("controller", "created unverified user's signature")
			}

			await AttachedRole.upsert({
				"roleID": testAdminRole.id,
				"userID": previousUser.id
			})

			Log.success("controller", "attached test unverified role to test unverified")

			await previousUser.update({ "emailVerifiedAt": null })

			Log.success("controller", "ensured unverified account is not yet verified")

			request.body = {
				"URL": await URLMaker.makeTemporaryURL("/user/verify", {
					"id": previousUser.id
				}, convertTimeToMilliseconds("00:00:45")),
				"email": testUnverifiedEmail,
				"password": "password"
			}

			request.nextMiddlewareArguments = { "hasPreprocessed": true }
		}
	}

	get postJobs(): Middleware[] {
		return [
			this
		]
	}
}
