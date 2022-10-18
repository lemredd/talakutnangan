import { readFile } from "fs"
import { promisify } from "util"

import { PreprocessedRequest, Response } from "!/types/dependent"

import Log from "$!/singletons/log"

import User from "%/models/user"
import Role from "%/models/role"
import Signature from "%/models/signature"
import Department from "%/models/department"
import AttachedRole from "%/models/attached_role"

import RoleFactory from "~/factories/role"
import UserFactory from "~/factories/user"
import SignatureFactory from "~/factories/signature"
import DepartmentFactory from "~/factories/department"
import {
	tag,
	user,
	post,
	comment,
	semester,
	profanity,
	department,
	role
} from "$/permissions/permission_list"

import Middleware from "!/bases/middleware"
import Condition from "%/helpers/condition"
import DevController from "!/controllers/dev"
import LocalLogInMiddleware from "!/middlewares/authentication/local_log_in"

interface OwnArguments {
	hasPreprocessed?: boolean
}

export default class extends DevController {
	get filePath(): string { return __filename }

	async handle(request: PreprocessedRequest<OwnArguments>, response: Response): Promise<void> {
		if (request.nextMiddlewareArguments?.hasPreprocessed) {
			response.status(this.status.OK).send(request.body).end()
		} else {
			const testSecretaryEmail = "secretary@example.net"
			const testSecretaryRoleName = "test_secretary"
			const testDepartmentName = "Test Institute Department"

			Log.success("controller", "searching for role")
			let testSecretaryRole = await Role.findOne({
				"where": new Condition().equal("name", testSecretaryRoleName).build()
			})

			Log.success("controller", "making for role")

			if (testSecretaryRole === null) {
				testSecretaryRole = await new RoleFactory()
				.name(() => testSecretaryRoleName)
				.departmentFlags(department.generateMask(
					"view"
				))
				.roleFlags(role.generateMask(
					"view"
				))
				.semesterFlags(semester.generateMask(
					"view"
				))
				.tagFlags(tag.generateMask(
					"view"
				))
				.postFlags(post.generateMask(
					"view",
					"create",
					"update",
					"archiveAndRestore",
					"readDepartmentScope",
					"writeOwnScope",
					"tag"
				))
				.commentFlags(comment.generateMask(
					"view",
					"create",
					"update",
					"archiveAndRestore",
					"readDepartmentScope",
					"writeOwnScope",
					"vote"
				))
				.profanityFlags(profanity.generateMask("view", "readOverallScope"))
				.userFlags(user.generateMask(
					"view",
					"create",
					"update",
					"readDepartmentScope",
					"writeDepartmentScope"
				))
				.auditTrailFlags(0)
				.insertOne()

				Log.success("controller", "created test role")
			}

			Log.success("controller", "searching for  dept")
			let testInstituteDepartment = await Department.findOne({
				"where": new Condition().equal("fullName", testDepartmentName).build()
			})

			Log.success("controller", "making for dept")
			if (testInstituteDepartment === null) {
				testInstituteDepartment = await new DepartmentFactory()
				.fullName(() => testDepartmentName)
				.mayAdmit()
				.insertOne()

				Log.success("controller", "created test department")
			}

			Log.success("controller", "searching for secretary user")
			let previousUser = await User.findOne({
				"where": new Condition().equal("email", testSecretaryEmail).build()
			})
			Log.success("controller", "making for secretary user")
			if (previousUser === null) {
				const createdUser = await new UserFactory()
				.email(() => testSecretaryEmail)
				.beReachableEmployee()
				.in(testInstituteDepartment)
				.insertOne()

				Log.success("controller", "created test secretary user")

				// eslint-disable-next-line require-atomic-updates
				previousUser = createdUser
			}

			const readAsync = promisify(readFile)
			const previousSignature = await Signature.findOne({
				"where": new Condition().equal("userID", previousUser.id).build()
			})
			Log.success("controller", "making for secretary's signature")
			if (previousSignature === null) {
				const sampleImagePath = `${this.root}/t/data/logo_bg_transparent.png`
				const sampleImage = await readAsync(sampleImagePath)
				await new SignatureFactory()
				.user(() => Promise.resolve(previousUser as User))
				.fileContents(() => sampleImage)
				.insertOne()

				Log.success("controller", "created secretary's signature")
			}

			await AttachedRole.upsert({
				"roleID": testSecretaryRole.id,
				"userID": previousUser.id
			})

			Log.success("controller", "attached test secretary role to test secretary user")

			request.body = {
				"email": testSecretaryEmail,
				"password": "password"
			}

			request.nextMiddlewareArguments = { "hasPreprocessed": true }
		}
	}

	get postJobs(): Middleware[] {
		return [
			new LocalLogInMiddleware(),
			this
		]
	}
}
