import { JSON_API_MEDIA_TYPE } from "$/types/server"

import App from "~/setups/app"
import RoleFactory from "~/factories/role"
import UserFactory from "~/factories/user"
import RequestEnvironment from "$!/singletons/request_environment"
import { user as permissionGroup } from "$/permissions/permission_list"
import { READ_ANYONE_ON_ALL_DEPARTMENTS } from "$/permissions/user_combinations"

import Route from "!%/api/user/list.get"

describe("GET /api/user", () => {
	beforeAll(async() => {
		await App.create(new Route())
	})

	it("can be accessed by permitted user and get single user", async() => {
		const adminRole = await new RoleFactory()
		.userFlags(permissionGroup.generateMask(...READ_ANYONE_ON_ALL_DEPARTMENTS))
		.insertOne()
		const { "user": admin, cookie } = await App.makeAuthenticatedCookie(adminRole)
		const student = await new UserFactory().beStudent().insertOne()

		const response = await App.request
		.get("/api/user")
		.query({ "filter": { "existence": "exists" } })
		.set("Cookie", cookie)
		.type(JSON_API_MEDIA_TYPE)
		.accept(JSON_API_MEDIA_TYPE)

		console.log(response.body)
		expect(response.statusCode).toBe(RequestEnvironment.status.OK)
		expect(response.body).toHaveProperty("data.0.attributes.email", admin.email)
		expect(response.body).toHaveProperty("data.1.attributes.email", student.email)
	})

	it("can be accessed by permitted user and get no user if empty", async() => {
		const adminRole = await new RoleFactory()
		.userFlags(permissionGroup.generateMask(...READ_ANYONE_ON_ALL_DEPARTMENTS))
		.insertOne()
		const { cookie } = await App.makeAuthenticatedCookie(adminRole)
		const student = await new UserFactory().beStudent().insertOne()
		await student.destroy()

		const response = await App.request
		.get("/api/user")
		.query({ "filter": { "existence": "exists",
			"kind": "student" } })
		.set("Cookie", cookie)
		.type(JSON_API_MEDIA_TYPE)
		.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.OK)
		expect(response.body).toHaveProperty("data", [])
	})
})
