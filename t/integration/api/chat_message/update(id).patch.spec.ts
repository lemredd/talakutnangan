import { JSON_API_MEDIA_TYPE } from "$/types/server"

import App from "~/setups/app"

import Socket from "!/ws/socket"
import RoleFactory from "~/factories/role"
import Factory from "~/factories/chat_message"
import SignatureFactory from "~/factories/signature"
import RequestEnvironment from "$!/singletons/request_environment"
import ChatMessageActivityFactory from "~/factories/chat_message_activity"
import makeConsultationChatNamespace from "$/namespace_makers/consultation_chat"

import Route from "!%/api/chat_message/update(id).patch"

describe("PATCH /api/chat_message/:id", () => {
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
		const model = await new Factory()
		.chatMessageActivity(() => Promise.resolve(chatMessageActivity))
		.serializedOne(true)
		const newModel = await new Factory()
		.chatMessageActivity(() => Promise.resolve(chatMessageActivity))
		.serializedOne(false)
		await new SignatureFactory()
		.user(() => Promise.resolve(employee))
		.insertOne()

		const response = await App.request
		.patch(`/api/chat_message/${model.data.id}`)
		.set("Cookie", cookie)
		.send({
			"data": {
				"attributes": {
					"data": newModel.data.attributes.data,
					"kind": newModel.data.attributes.kind
				},
				"id": String(model.data.id),
				"type": "chat_message"
			}
		})
		.type(JSON_API_MEDIA_TYPE)
		.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.NO_CONTENT)
		const previousCalls = Socket.consumePreviousCalls()
		expect(previousCalls[0].functionName).toBe("emitToClients")
		expect(previousCalls[0].arguments).toHaveProperty("eventName", "update")
		expect(previousCalls[0].arguments).toHaveProperty(
			"namespace",
			makeConsultationChatNamespace(String(chatMessageActivity.consultationID))
		)
		expect(previousCalls[0].arguments).toHaveProperty(
			"data.0.data.attributes.data",
			newModel.data.attributes.data
		)
	})
})
