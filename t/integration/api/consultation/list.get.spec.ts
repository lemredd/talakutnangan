import { JSON_API_MEDIA_TYPE } from "$/types/server"

import App from "~/set-ups/app"

import RoleFactory from "~/factories/role"
import Factory from "~/factories/consultation"
import RequestEnvironment from "$!/singletons/request_environment"
import ChatMessageActivityFactory from "~/factories/chat_message_activity"

import Route from "!%/api/consultation/list.get"

describe("GET /api/consultation", () => {
	beforeAll(async() => {
		await App.create(new Route())
	})

	it("can be accessed by authenticated user", async() => {
		const normalRole = await new RoleFactory().insertOne()
		const { "user": employee, cookie } = await App.makeAuthenticatedCookie(
			normalRole,
			userFactory => userFactory.beReachableEmployee())
		const model = await new Factory().insertOne()
		await new ChatMessageActivityFactory()
		.user(() => Promise.resolve(employee))
		.consultation(() => Promise.resolve(model))
		.insertOne()

		const response = await App.request
		.get("/api/consultation")
		.set("Cookie", cookie)
		.query({
			"filter": {
				"existence": "exists",
				"user": String(employee.id)
			}
		})
		.type(JSON_API_MEDIA_TYPE)
		.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.OK)
		expect(response.body).toHaveProperty("data.0.id", String(model.id))
		expect(response.body).not.toHaveProperty("data.1")
	})
})
