import { shallowMount, flushPromises } from "@vue/test-utils"
import RequestEnvironment from "$/helpers/request_environment"
import type { DeserializedConsultationResource } from "$/types/documents/consultation"
import type { DeserializedChatMessageListDocument } from "$/types/documents/chat_message"

import Component from "./chat_window.vue"

describe("Component: consultation/chat_window", () => {
	it("should show main controllers if ongoing", async() => {
		fetchMock.mockResponseOnce("", { "status": RequestEnvironment.status.NO_CONTENT })
		const fakeData = {
			"id": "1",
			"actionTaken": "",
			"endDatetime": new Date(),
			"reason": "",
			"scheduledStartDatetime": new Date(),
			"status": "will_start",
			"type": "consultation",
			"chatMessages": {
				"data": []
			} as DeserializedChatMessageListDocument
		} as DeserializedConsultationResource
		const wrapper = shallowMount<any>(Component, {
			"props": {
				"consultation": fakeData
			}
		})

		const userController = wrapper.findComponent({ "name": "UserController" })
		await userController.trigger("start-consultation")
		await flushPromises()

		// TODO: Test if consultation fetcher sends data
		const events = wrapper.emitted("updatedConsultationAttributes")
		expect(events).toHaveLength(1)
	})
})
