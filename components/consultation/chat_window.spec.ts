import { shallowMount, flushPromises } from "@vue/test-utils"
import RequestEnvironment from "$/helpers/request_environment"
import type { DeserializedConsultationResource } from "$/types/documents/consultation"
import type { DeserializedChatMessageListDocument } from "$/types/documents/chat_message"

import Component from "./chat_window.vue"

describe("Component: consultation/chat_window", () => {
	it("should start consultation", async() => {
		const scheduledStartAt = new Date()
		// eslint-disable-next-line no-undef
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
		const wrapper = shallowMount<any>(Component, {
			"props": {
				"chatMessages": fakeChatMessage,
				"consultation": fakeConsultation
			}
		})

		const userController = wrapper.findComponent({ "name": "UserController" })
		await userController.trigger("start-consultation")
		await flushPromises()

		const events = wrapper.emitted("updatedConsultationAttributes")
		expect(events).toHaveLength(1)
		const castFetch = fetch as jest.Mock<any, any>
		const [ [ request ] ] = castFetch.mock.calls
		expect(request).toHaveProperty("method", "PATCH")
		expect(request).toHaveProperty("url", "/api/consultation/1")
		const body = await request.json()
		expect(body).toHaveProperty("data.attributes.actionTaken", null)
		expect(body).toHaveProperty("data.attributes.finishedAt", null)
		expect(body).toHaveProperty("data.attributes.reason", "")
		expect(body).toHaveProperty("data.attributes.scheduledStartAt", scheduledStartAt.toJSON())
		expect(body).not.toHaveProperty("data.attributes.startedAt", null)
		expect(body).toHaveProperty("data.id", "1")
		expect(body).toHaveProperty("data.type", "consultation")
	})
})
