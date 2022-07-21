import { JSON_API_MEDIA_TYPE } from "$/types/server"

import App from "~/set-ups/app"
import RoleFactory from "~/factories/role"
import DepartmentFactory from "~/factories/department"

import { READ } from "$/permissions/department_combinations"
import RequestEnvironment from "$!/singletons/request_environment"
import { department as permissionGroup } from "$/permissions/permission_list"

import Route from "!/app/routes/api/department/list.get"

describe("GET /api/deparment/list", () => {
	beforeAll(async () => {
		await App.create(new Route())
	})

	it("can be accessed by permitted user and get multiple departments", async () => {
		const anyRole = await new RoleFactory()
			.departmentFlags(permissionGroup.generateMask(...READ))
			.insertOne()
		const { user: admin, cookie } = await App.makeAuthenticatedCookie(anyRole)
		const departments = await (new DepartmentFactory()).insertMany(3)

		const response = await App.request
			.get("/api/department/list")
			.set("Cookie", cookie)
			.type(JSON_API_MEDIA_TYPE)
			.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.OK)
		expect(response.body).toHaveProperty("data.0.type", "department")
		expect(response.body).toHaveProperty("data.0.id", admin.departmentID)
		expect(response.body).toHaveProperty("data.1.attributes.fullName", departments[0].fullName)
		expect(response.body).toHaveProperty("data.2.attributes.fullName", departments[1].fullName)
		expect(response.body).toHaveProperty("data.3.attributes.fullName", departments[2].fullName)
	})
})
