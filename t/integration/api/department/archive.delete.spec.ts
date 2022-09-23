import { JSON_API_MEDIA_TYPE } from "$/types/server"

import App from "~/setups/app"
import RoleFactory from "~/factories/role"
import Department from "%/models/department"
import DepartmentFactory from "~/factories/department"
import RequestEnvironment from "$!/singletons/request_environment"
import { ARCHIVE_AND_RESTORE } from "$/permissions/department_combinations"
import { department as permissionGroup } from "$/permissions/permission_list"

import Route from "!%/api/department/archive.delete"

describe("DELETE /api/department", () => {
	beforeAll(async() => {
		await App.create(new Route())
	})

	it("can be accessed by authenticated user", async() => {
		const adminRole = await new RoleFactory()
		.departmentFlags(permissionGroup.generateMask(...ARCHIVE_AND_RESTORE))
		.insertOne()
		const { cookie } = await App.makeAuthenticatedCookie(adminRole)
		const department = await new DepartmentFactory().insertOne()

		const response = await App.request
		.delete("/api/department")
		.send({
			"data": [
				{
					"id": String(department.id),
					"type": "department"
				}
			]
		})
		.set("Cookie", cookie)
		.type(JSON_API_MEDIA_TYPE)
		.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.NO_CONTENT)
		expect(await Department.findByPk(department.id)).toBeNull()
	})
})
