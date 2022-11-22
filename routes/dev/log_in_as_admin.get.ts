import { PreprocessedRequest, Response } from "!/types/dependent"

import Log from "$!/singletons/log"

import User from "%/models/user"
import Role from "%/models/role"
import AttachedRole from "%/models/attached_role"

import RoleFactory from "~/factories/role"
import UserFactory from "~/factories/user"
import DepartmentFactory from "~/factories/department"

import Middleware from "!/bases/middleware"
import Condition from "%/helpers/condition"
import DevController from "!/controllers/dev"
import LocalLogInMiddleware from "!/middlewares/authentication/local_log_in"
import Department from "%/models/department"

interface OwnArguments {
	hasPreprocessed?: boolean
}

export default class extends DevController {
	get filePath(): string { return __filename }

	async handle(request: PreprocessedRequest<OwnArguments>, response: Response): Promise<void> {
		if (request.nextMiddlewareArguments?.hasPreprocessed) {
			response.status(this.status.OK).end()
		} else {
			const testAdminEmail = "dev_admin@example.net"
			const testRole = "test_admin"
			const testDepartmentName = "Test Department"

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

				Log.success("controller", "created test admin role")
			}

			Log.success("controller", "searching for  dept")
			let testDepartment = await Department.findOne({
				"where": new Condition().equal("fullName", testDepartmentName).build()
			})

			Log.success("controller", "making for  dept")
			if (testDepartment === null) {
				testDepartment = await new DepartmentFactory()
				.fullName(() => testDepartmentName)
				.mayNotAdmit()
				.insertOne()

				Log.success("controller", "created test department")
			}


			let previousUser = await User.findOne({
				"where": new Condition().equal("email", testAdminEmail).build()
			})

			if (previousUser === null) {
				const user = await new UserFactory()
				.email(() => testAdminEmail)
				.beUnreachableEmployee()

				.insertOne()

				Log.success("controller", "created test admin")

				previousUser = user
			}

			await AttachedRole.upsert({
				"userID": previousUser.id,
				"roleID": testAdminRole.id
			})

			Log.success("controller", "attached test admin role to test admin")

			request.body = {
				"email": testAdminEmail,
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
