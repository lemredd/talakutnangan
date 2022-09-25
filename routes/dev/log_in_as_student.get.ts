import { PreprocessedRequest, Response } from "!/types/dependent"

import Log from "$!/singletons/log"

import User from "%/models/user"
import Role from "%/models/role"
import Department from "%/models/department"
import AttachedRole from "%/models/attached_role"
import StudentDetail from "%/models/student_detail"

import RoleFactory from "~/factories/role"
import UserFactory from "~/factories/user"
import DepartmentFactory from "~/factories/department"
import StudentDetailFactory from "~/factories/student_detail"
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
			response.status(this.status.OK).end()
		} else {
			const testStudentEmail = "student@example.net"
			const testRole = "test_student"
			const testStudentNumber = "000-0001"
			const testDepartment = "Test Institute Department"

			Log.success("controller", "searching for student role")
			let testStudentRole = await Role.findOne({
				"where": new Condition().equal("name", testRole).build()
			})

			Log.success("controller", "making for student role")

			if (testStudentRole === null) {
				testStudentRole = await new RoleFactory()
				.name(() => testRole)
				.departmentFlags(department.generateMask("view"))
				.roleFlags(role.generateMask("view"))
				.semesterFlags(semester.generateMask("view"))
				.tagFlags(tag.generateMask("view"))
				.postFlags(post.generateMask("view", "readDepartmentScope"))
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
					"readOwnScope",
					"writeOwnScope"
				))
				.auditTrailFlags(0)
				.insertOne()

				Log.success("controller", "created test student role")
			}

			Log.success("controller", "searching for student dept")
			let testInstituteDepartment = await Department.findOne({
				"where": new Condition().equal("fullName", testDepartment).build()
			})

			Log.success("controller", "making for student department")

			if (testInstituteDepartment === null) {
				testInstituteDepartment = await new DepartmentFactory()
				.fullName(() => testDepartment)
				.mayAdmit()
				.insertOne()

				Log.success("controller", "created test institute department")
			}

			Log.success("controller", "searching for student user")
			let previousUser = await User.findOne({
				"where": new Condition().equal("email", testStudentEmail).build()
			})

			Log.success("controller", "making for student department")
			if (previousUser === null) {
				const createdUser = await new UserFactory()
				.email(() => testStudentEmail)
				.beStudent()
				.in(testInstituteDepartment)
				.insertOne()

				Log.success("controller", "created test student")

				previousUser = createdUser
			}

			Log.success("controller", "searching for student detail")
			let previousStudentDetail = await StudentDetail.findOne({
				"where": new Condition().equal("studentNumber", testStudentNumber).build()
			})

			Log.success("controller", "making for student detail")
			if (previousStudentDetail === null) {
				const createdStudentDetail = await new StudentDetailFactory()
				.user(() => Promise.resolve(previousUser as User))
				.studentNumber(() => testStudentNumber)
				.insertOne()

				Log.success("controller", "created test student detail")

				previousStudentDetail = createdStudentDetail
			}

			await AttachedRole.upsert({
				"roleID": testStudentRole.id,
				"userID": previousUser.id
			})

			Log.success("controller", "attached test student role to test student")

			request.body = {
				"email": testStudentEmail,
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
