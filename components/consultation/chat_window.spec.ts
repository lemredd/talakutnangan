import { shallowMount, flushPromises } from "@vue/test-utils"
import RequestEnvironment from "$/singletons/request_environment"
import type { DeserializedConsultationResource } from "$/types/documents/consultation"
import type { DeserializedChatMessageListDocument } from "$/types/documents/chat_message"
import type {
	DeserializedChatMessageActivityResource
} from "$/types/documents/chat_message_activity"

import Component from "./chat_window.vue"

describe("Component: consultation/chat_window", () => {
	it("should start consultation", async() => {
		const scheduledStartAt = new Date()
		fetchMock.mockResponseOnce("", { "status": RequestEnvironment.status.NO_CONTENT })
		const fakeConsultation = {
			"actionTaken": null,
			"finishedAt": null,
			"id": "1",
			"reason": "",
			scheduledStartAt,
			"startedAt": null,
			"type": "consultation"
		} as DeserializedConsultationResource
		const fakeChatMessage = {
			"data": []
		} as DeserializedChatMessageListDocument
		const fakeChatMessageActivity = {
			"id": "1",
			"receivedMessageAt": new Date(),
			"seenMessageAt": new Date(),
			"type": "chat_message_activity"
		} as DeserializedChatMessageActivityResource
		const wrapper = shallowMount<any>(Component, {
			"props": {
				"chatMessages": fakeChatMessage,
				"consultation": fakeConsultation,
				"ownChatMessageActivity": fakeChatMessageActivity
			}
		})

		const userController = wrapper.findComponent({ "name": "UserController" })
		await userController.trigger("start-consultation")
		await flushPromises()

		const events = wrapper.emitted("updatedConsultationAttributes")
		expect(events).toHaveLength(1)
		const castFetch = fetch as jest.Mock<any, any>
		const [ [ firstRequest ], [ secondRequest ] ] = castFetch.mock.calls
		expect(firstRequest).toHaveProperty("method", "PATCH")
		expect(firstRequest).toHaveProperty("url", "/api/consultation/1")
		const firstRequestBody = await firstRequest.json()
		expect(firstRequestBody).toHaveProperty("data.attributes.actionTaken", null)
		expect(firstRequestBody).toHaveProperty("data.attributes.finishedAt", null)
		expect(firstRequestBody).toHaveProperty("data.attributes.reason", "")
		expect(firstRequestBody).toHaveProperty(
			"data.attributes.scheduledStartAt",
			scheduledStartAt.toJSON()
		)
		expect(firstRequestBody).not.toHaveProperty("data.attributes.startedAt", null)
		expect(firstRequestBody).toHaveProperty("data.id", "1")
		expect(firstRequestBody).toHaveProperty("data.type", "consultation")
		expect(secondRequest).toHaveProperty("method", "POST")
		expect(secondRequest).toHaveProperty("url", "/api/chat_message")
		const secondRequestBody = await secondRequest.json()
		expect(secondRequestBody).toHaveProperty("data.attributes.kind", "status")
		expect(secondRequestBody).toHaveProperty(
			"data.attributes.relationships.chatMessageActivity.data.",
			fakeChatMessageActivity.id
		)
	})
})
