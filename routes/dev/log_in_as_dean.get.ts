import { PreprocessedRequest, Response } from "!/types/dependent"

import Log from "$!/singletons/log"

import User from "%/models/user"
import Role from "%/models/role"
import Department from "%/models/department"
import AttachedRole from "%/models/attached_role"
import convertTimeToMinutes from "$/time/convert_time_to_minutes"

import RoleFactory from "~/factories/role"
import UserFactory from "~/factories/user"
import DepartmentFactory from "~/factories/department"
import EmployeeScheduleFactory from "~/factories/employee_schedule"
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
			const testDeanEmail = "dean@example.net"
			const testRole = "test_dean"
			const testDepartment = "Test Institute Department"

			Log.success("controller", "searching for dean role")
			let testDeanRole = await Role.findOne({
				"where": new Condition().equal("name", testRole).build()
			})

			Log.success("controller", "making for dean role")

			if (testDeanRole === null) {
				testDeanRole = await new RoleFactory()
				.name(() => testRole)
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
					"view",
					"create",
					"update",
					"archiveAndRestore"
				))
				.postFlags(post.generateMask(
					"view",
					"create",
					"update",
					"archiveAndRestore",
					"readDepartmentScope",
					"writeDepartmentScope",
					"tag"
				))
				.commentFlags(comment.generateMask(
					"view",
					"create",
					"update",
					"archiveAndRestore",
					"readDepartmentScope",
					"writeDepartmentScope",
					"vote"
				))
				.profanityFlags(profanity.generateMask(
					"view",
					"readOverallScope"
				))
				.userFlags(user.generateMask(
					"view",
					"create",
					"update",
					"archiveAndRestore",
					"readDepartmentScope",
					"writeDepartmentScope"
				))
				.auditTrailFlags(0)
				.insertOne()

				Log.success("controller", "created test dean role")
			}

			Log.success("controller", "searching for dean dept")
			let testInstituteDepartment = await Department.findOne({
				"where": new Condition().equal("fullName", testDepartment).build()
			})

			Log.success("controller", "making for dean department")
			if (testInstituteDepartment === null) {
				testInstituteDepartment = await new DepartmentFactory()
				.fullName(() => testDepartment)
				.mayAdmit()
				.insertOne()

				Log.success("controller", "created test institute department")
			}

			Log.success("controller", "searching for dean user")
			let previousUser = await User.findOne({
				"where": new Condition().equal("email", testDeanEmail).build()
			})
			Log.success("controller", "making for dean dept")
			if (previousUser === null) {
				const createdUser = await new UserFactory()
				.email(() => testDeanEmail)
				.beReachableEmployee()
				.in(testInstituteDepartment)
				.insertOne()

				await new EmployeeScheduleFactory()
				.user(() => Promise.resolve(createdUser))
				.dayName(() => "monday")
				.scheduleStart(() => convertTimeToMinutes("08:00"))
				.scheduleEnd(() => convertTimeToMinutes("12:00"))
				.insertOne()
				await new EmployeeScheduleFactory()
				.user(() => Promise.resolve(createdUser))
				.dayName(() => "monday")
				.scheduleStart(() => convertTimeToMinutes("13:00"))
				.scheduleEnd(() => convertTimeToMinutes("17:00"))
				.insertOne()
				await new EmployeeScheduleFactory()
				.user(() => Promise.resolve(createdUser))
				.dayName(() => "tuesday")
				.scheduleStart(() => convertTimeToMinutes("08:00"))
				.scheduleEnd(() => convertTimeToMinutes("17:00"))
				.insertOne()
				await new EmployeeScheduleFactory()
				.user(() => Promise.resolve(createdUser))
				.dayName(() => "thursday")
				.scheduleStart(() => convertTimeToMinutes("08:00"))
				.scheduleEnd(() => convertTimeToMinutes("17:00"))
				.insertOne()
				await new EmployeeScheduleFactory()
				.user(() => Promise.resolve(createdUser))
				.dayName(() => "friday")
				.scheduleStart(() => convertTimeToMinutes("08:00"))
				.scheduleEnd(() => convertTimeToMinutes("17:00"))
				.insertOne()
				await new EmployeeScheduleFactory()
				.user(() => Promise.resolve(createdUser))
				.dayName(() => "wednesday")
				.scheduleStart(() => convertTimeToMinutes("08:00"))
				.scheduleEnd(() => convertTimeToMinutes("17:00"))
				.insertOne()
				await new EmployeeScheduleFactory()
				.user(() => Promise.resolve(createdUser))
				.dayName(() => "saturday")
				.scheduleStart(() => convertTimeToMinutes("08:00"))
				.scheduleEnd(() => convertTimeToMinutes("17:00"))
				.insertOne()
				await new EmployeeScheduleFactory()
				.user(() => Promise.resolve(createdUser))
				.dayName(() => "sunday")
				.scheduleStart(() => convertTimeToMinutes("08:00"))
				.scheduleEnd(() => convertTimeToMinutes("17:00"))
				.insertOne()

				Log.success("controller", "created test dean")

				previousUser = createdUser
			}

			await AttachedRole.upsert({
				"userID": previousUser.id,
				"roleID": testDeanRole.id
			})

			Log.success("controller", "attached test dean role to test dean")

			request.body = {
				"email": testDeanEmail,
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
