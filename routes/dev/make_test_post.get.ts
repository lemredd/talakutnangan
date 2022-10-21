import { Request, Response } from "!/types/dependent"

import Log from "$!/singletons/log"

import User from "%/models/user"
import Role from "%/models/role"
import Department from "%/models/department"

import RoleFactory from "~/factories/role"
import UserFactory from "~/factories/user"
import PostFactory from "~/factories/post"
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

import Condition from "%/helpers/condition"
import DevController from "!/controllers/dev"

export default class extends DevController {
	get filePath(): string { return __filename }

	async handle(request: Request, response: Response): Promise<void> {
		const testSecretaryEmail = "secretary@example.net"
		const testSecretaryRoleName = "test_secretary"
		const testDepartment = "Test Department"

		Log.success("controller", "searching for secretary role")
		let testSecretaryRole = await Role.findOne({
			"where": new Condition().equal("name", testSecretaryRoleName).build()
		})

		Log.success("controller", "making for secretary role")

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

			Log.success("controller", "created test secretary role")
		}

		Log.success("controller", "searching for secretary dept")
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

		Log.success("controller", "searching for secretary user")
		let previousSecretaryUser = await User.findOne({
			"where": new Condition().equal("email", testSecretaryEmail).build()
		})
		Log.success("controller", "making for secretary user")
		if (previousSecretaryUser === null) {
			const createdUser = await new UserFactory()
			.email(() => testSecretaryEmail)
			.beReachableEmployee()
			.in(testInstituteDepartment)
			.insertOne()

			Log.success("controller", "created test secretary user")

			previousSecretaryUser = createdUser
		}

		const postFactory = new PostFactory()
		const postModel = await postFactory.serializedOne(true)

		response.status(this.status.OK).send({
			"data": [
				{
					"email": testSecretaryEmail,
					"password": "password"
				},
				postModel
			],
			"meta": {
				"info": "Please log in one of the following credentials manually"
			}
		})
	}
}
