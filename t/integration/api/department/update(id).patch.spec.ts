import { JSON_API_MEDIA_TYPE } from "$/types/server"

import App from "~/setups/app"
import RoleFactory from "~/factories/role"
import DepartmentFactory from "~/factories/department"
import { UPDATE } from "$/permissions/department_combinations"
import RequestEnvironment from "$!/singletons/request_environment"
import { department as permissionGroup } from "$/permissions/permission_list"

import Route from "!%/api/department/update(id).patch"

describe("PATCH /api/department/:id", () => {
	beforeAll(async() => {
		await App.create(new Route())
	})

	it("can be accessed by authenticated user", async() => {
		const adminRole = await new RoleFactory()
		.departmentFlags(permissionGroup.generateMask(...UPDATE))
		.insertOne()
		const { user, cookie } = await App.makeAuthenticatedCookie(adminRole)
		const department = await new DepartmentFactory().insertOne()
		const newDepartmentDetails = await new DepartmentFactory().makeOne()

		const response = await App.request
		.patch(`/api/department/${department.id}`)
		.set("Cookie", cookie)
		.send({
			"data": {
				"type": "department",
				"id": String(department.id),
				"attributes": {
					"acronym": newDepartmentDetails.acronym,
					"fullName": newDepartmentDetails.fullName,
					"mayAdmit": newDepartmentDetails.mayAdmit
				}
			},
			"meta": {
				"password": user.password
			}
		})
		.type(JSON_API_MEDIA_TYPE)
		.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.NO_CONTENT)
	})
})
