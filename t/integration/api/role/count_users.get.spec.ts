import { JSON_API_MEDIA_TYPE } from "$/types/server"

import App from "~/setups/app"
import RoleFactory from "~/factories/role"
import { READ } from "$/permissions/role_combinations"
import RequestEnvironment from "$!/singletons/request_environment"
import { role as permissionGroup } from "$/permissions/permission_list"

import Route from "!%/api/role/count_users.get"

describe("GET /api/role/count_users", () => {
	beforeAll(async() => {
		await App.create(new Route())
	})

	it("can be accessed by permitted user and get user count", async() => {
		const adminRole = await new RoleFactory()
		.roleFlags(permissionGroup.generateMask(...READ))
		.insertOne()
		const { cookie } = await App.makeAuthenticatedCookie(adminRole)

		const response = await App.request
		.get("/api/role/count_users")
		.query({
			"filter": {
				"IDs": String(adminRole.id)
			}
		})
		.set("Cookie", cookie)
		.type(JSON_API_MEDIA_TYPE)
		.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.OK)
		expect(response.body).toHaveProperty("data.0.type", "role")
		expect(response.body).toHaveProperty("data.0.id", String(adminRole.id))
		expect(response.body).toHaveProperty("data.0.meta.userCount", 1)
		expect(response.body).not.toHaveProperty("data.1")
	})
})
