import { JSON_API_MEDIA_TYPE } from "$/types/server"
import RequestEnvironment from "$!/singletons/request_environment"

import App from "~/setups/app"
import RoleFactory from "~/factories/role"
import { user as permissionGroup } from "$/permissions/permission_list"
import { READ_OWN } from "$/permissions/user_combinations"

import Route from "!%/t/policy/permission-based.get"

describe("GET /t/policy/permission-based", () => {
	beforeAll(async () => {
		await App.create(new Route())
	})

	it("can be accessed by permitted user", async () => {
		const normalRole = await new RoleFactory()
			.userFlags(permissionGroup.generateMask(...READ_OWN))
			.insertOne()
		const { user, cookie } = await App.makeAuthenticatedCookie(normalRole)

		const response = await App.request
			.get("/t/policy/permission-based")
			.set("Cookie", cookie)
			.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.OK)
	})

	it("cannot be accessed by unpermitted user", async () => {
		const { user, cookie } = await App.makeAuthenticatedCookie()

		const response = await App.request
			.get("/t/policy/permission-based")
			.set("Cookie", cookie)
			.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.UNAUTHORIZED)
	})

	it("cannot be accessed by guest user", async () => {
		const response = await App.request
			.get("/t/policy/permission-based")
			.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.UNAUTHORIZED)
	})
})
