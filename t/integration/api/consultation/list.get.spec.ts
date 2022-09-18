import { JSON_API_MEDIA_TYPE } from "$/types/server"

import App from "~/set-ups/app"

import RoleFactory from "~/factories/role"
import Factory from "~/factories/chat_message"
import RequestEnvironment from "$!/singletons/request_environment"
import ChatMessageActivityFactory from "~/factories/chat_message_activity"

import Route from "!%/api/chat_message/list.get"

describe("GET /api/chat_message", () => {
	beforeAll(async() => {
		await App.create(new Route())
	})

	it("can be accessed by authenticated user", async() => {
		const normalRole = await new RoleFactory().insertOne()
		const { "user": employee, cookie } = await App.makeAuthenticatedCookie(
			normalRole,
			userFactory => userFactory.beReachableEmployee())
		const chatMessageActivity = await new ChatMessageActivityFactory()
		.user(() => Promise.resolve(employee))
		.insertOne()
		const { consultation } = chatMessageActivity
		const model = await new Factory()
		.chatMessageActivity(() => Promise.resolve(chatMessageActivity))
		.serializedOne(true)

		const response = await App.request
		.get("/api/chat_message")
		.set("Cookie", cookie)
		.query({
			"filter": {
				"consultationIDs": consultation.id,
				"existence": "exists"
			}
		})
		.type(JSON_API_MEDIA_TYPE)
		.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.OK)
		expect(response.body).toHaveProperty("data.0.id", model.data.id)
		expect(response.body).not.toHaveProperty("data.1")
	})
})
