import { JSON_API_MEDIA_TYPE } from "$/types/server"

import App from "~/setups/app"
import RoleFactory from "~/factories/role"
import { READ } from "$/permissions/role_combinations"
import RequestEnvironment from "$!/singletons/request_environment"
import { role as permissionGroup } from "$/permissions/permission_list"

import Route from "!%/api/role/list.get"

describe("GET /api/role", () => {
	beforeAll(async() => {
		await App.create(new Route())
	})

	it("can be accessed by permitted user and multiple roles", async() => {
		const adminRole = await new RoleFactory()
		.roleFlags(permissionGroup.generateMask(...READ))
		.insertOne()
		const { cookie } = await App.makeAuthenticatedCookie(adminRole)
		const roles = await new RoleFactory().insertMany(3)

		const response = await App.request
		.get("/api/role")
		.set("Cookie", cookie)
		.type(JSON_API_MEDIA_TYPE)
		.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.OK)
		expect(response.body).toHaveProperty("data.0.attributes.name", adminRole.name)
		expect(response.body).toHaveProperty("data.1.attributes.name", roles[0].name)
		expect(response.body).toHaveProperty("data.2.attributes.name", roles[1].name)
		expect(response.body).toHaveProperty("data.3.attributes.name", roles[2].name)
	})
})
