import { JSON_API_MEDIA_TYPE } from "$/types/server"

import App from "~/setups/app"
import RoleFactory from "~/factories/role"
import DepartmentFactory from "~/factories/department"
import { READ } from "$/permissions/department_combinations"
import RequestEnvironment from "$!/singletons/request_environment"
import { department as permissionGroup } from "$/permissions/permission_list"

import Route from "!%/api/department/count_users.get"

describe("GET /api/department/count_users", () => {
	beforeAll(async() => {
		await App.create(new Route())
	})

	it("can be accessed by permitted user and get user count", async() => {
		const adminDepartment = await new DepartmentFactory().insertOne()
		const adminRole = await new RoleFactory()
		.departmentFlags(permissionGroup.generateMask(...READ))
		.insertOne()
		const { cookie } = await App.makeAuthenticatedCookie(
			adminRole,
			userFactory => userFactory.in(adminDepartment)
		)

		const response = await App.request
		.get("/api/department/count_users")
		.query({
			"filter": {
				"IDs": String(adminDepartment.id)
			}
		})
		.set("Cookie", cookie)
		.type(JSON_API_MEDIA_TYPE)
		.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.OK)
		expect(response.body).toHaveProperty("data.0.type", "department")
		expect(response.body).toHaveProperty("data.0.id", String(adminDepartment.id))
		expect(response.body).toHaveProperty("data.0.meta.userCount", 1)
		expect(response.body).not.toHaveProperty("data.1")
	})
})
