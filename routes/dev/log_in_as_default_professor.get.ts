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
			const testPassword = "default_professor"
			const testProfessorEmail = `${testPassword}@example.net`
			const testProfessorRoleName = "test_professor"
			const testDepartmentName = "Test Institute Department"

			Log.success("controller", "searching for role")
			let testProfessorRole = await Role.findOne({
				"where": new Condition().equal("name", testProfessorRoleName).build()
			})

			Log.success("controller", "making for role")

			if (testProfessorRole === null) {
				testProfessorRole = await new RoleFactory()
				.name(() => testProfessorRoleName)
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
					"update",
					"readDepartmentScope",
					"writeOwnScope"
				))
				.auditTrailFlags(0)
				.insertOne()

				Log.success("controller", "created test role")
			}

			Log.success("controller", "searching for dept")
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

			Log.success("controller", "searching for professor user")
			let previousUser = await User.findOne({
				"where": new Condition().equal("email", testProfessorEmail).build()
			})
			Log.success("controller", "making for professor user")
			if (previousUser === null) {
				const createdUser = await new UserFactory()
				.email(() => testProfessorEmail)
				.password(() => testPassword)
				.beReachableEmployee()
				.in(testInstituteDepartment)
				.insertOne()

				Log.success("controller", "created test professor user")

				// eslint-disable-next-line require-atomic-updates
				previousUser = createdUser
			}

			const readAsync = promisify(readFile)
			const previousSignature = await Signature.findOne({
				"where": new Condition().equal("userID", previousUser.id).build()
			})
			Log.success("controller", "making for default professors's signature")
			if (previousSignature === null) {
				const sampleImagePath = `${this.root}/t/data/logo_bg_transparent.png`
				const sampleImage = await readAsync(sampleImagePath)
				await new SignatureFactory()
				.user(() => Promise.resolve(previousUser as User))
				.fileContents(() => sampleImage)
				.insertOne()

				Log.success("controller", "created default professors's signature")
			}

			await AttachedRole.upsert({
				"roleID": testProfessorRole.id,
				"userID": previousUser.id
			})

			Log.success("controller", "attached test professor role to test professor user")

			request.body = {
				"email": testProfessorEmail,
				"password": testPassword
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
