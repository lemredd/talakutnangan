import { JSON_API_MEDIA_TYPE } from "$/types/server"

import App from "~/set-ups/app"
import RoleFactory from "~/factories/role"
import Model from "%/models/attached_chat_file"
import Factory from "~/factories/attached_chat_file"
import ChatMessageFactory from "~/factories/chat_message"
import RequestEnvironment from "$!/singletons/request_environment"
import ChatMessageActivityFactory from "~/factories/chat_message_activity"

import Route from "!%/api/attached_chat_file/destroy.delete"

describe("DELETE /api/attached_chat_file", () => {
	beforeAll(async() => {
		await App.create(new Route())
	})

	it("can be accessed by authenticated user", async() => {
		const adminRole = await new RoleFactory().insertOne()
		const { user, cookie } = await App.makeAuthenticatedCookie(adminRole, userFactory => {
			return userFactory.beStudent()
		})

		const chatMessageActivity = await new ChatMessageActivityFactory()
		.user(() => Promise.resolve(user))
		.insertOne()
		const chatMessage = await new ChatMessageFactory()
		.chatMessageActivity(() => Promise.resolve(chatMessageActivity))
		.insertOne()
		const model = await new Factory().chatMessage(() => Promise.resolve(chatMessage)).insertOne()

		const response = await App.request
		.delete("/api/attached_chat_file")
		.send({
			"data": [
				{
					"id": String(model.id),
					"type": "attached_chat_file"
				}
			]
		})
		.set("Cookie", cookie)
		.type(JSON_API_MEDIA_TYPE)
		.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.NO_CONTENT)
		expect(await Model.findOne({ "where": { "id": model.id } } )).toBeNull()
	})
})
