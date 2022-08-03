import { PreprocessedRequest, Response } from "!/types/dependent"

import Log from "$!/singletons/log"

import User from "%/models/user"
import Role from "%/models/role"
import Department from "%/models/department"
import AttachedRole from "%/models/attached_role"

import RoleFactory from "~/factories/role"
import UserFactory from "~/factories/user"
import DepartmentFactory from "~/factories/department"

import Middleware from "!/bases/middleware"
import Condition from "%/managers/helpers/condition"
import DevController from "!/controllers/dev_controller"
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
			const testDepartment = "Test department"

			Log.success("controller", "searching for dean role")
			let testDeanRole = await Role.findOne({
				where: (new Condition()).equal("name", testRole).build()
			})

			Log.success("controller", "making for dean role")

			if (testDeanRole === null) {
				testDeanRole = await new RoleFactory()
					.name(() => testRole)
					.departmentFlags(0xFFF)
					.roleFlags(0x1)
					.semesterFlags(0x1)
					.tagFlags(0xFFF)
					.postFlags(0xFFF)
					.commentFlags(0xFFF)
					.profanityFlags(0xFFF)
					.userFlags(0xFFF)
					.auditTrailFlags(0xFFF)
					.insertOne()

				Log.success("controller", "created test dean role")
			}

			Log.success("controller", "searching for dean dept")
			let testInstituteDepartment = await Department.findOne({
				where: (new Condition()).equal("fullName", testDepartment).build()
			})

			Log.success("controller", "making for dean dept")
			if (testInstituteDepartment === null) {
				testInstituteDepartment = await new DepartmentFactory()
					.insertOne()

				Log.success("controller", "created test institute department")
			}

			Log.success("controller", "searching for dean user")
			let previousUser = await User.findOne({
				where: (new Condition()).equal("email", testDeanEmail).build()
			})
			Log.success("controller", "making for dean dept")
			if (previousUser === null) {
				const user = await new UserFactory()
					.email(() => testDeanEmail)
					.beReachableEmployee()
					.insertOne()

				Log.success("controller", "created test dean")

				previousUser = user
			}

			await AttachedRole.upsert({
				userID: previousUser.id,
				roleID: testDeanRole.id
			})

			Log.success("controller", "attached test admin role to test admin")

			request.body = {
				email: testDeanEmail,
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
