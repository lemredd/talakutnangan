import { shallowMount, flushPromises } from "@vue/test-utils"
import type { DeserializedConsultationResource } from "$/types/documents/consultation"
import type { DeserializedChatMessageListDocument } from "$/types/documents/chat_message"

import RequestEnvironment from "$/singletons/request_environment"
import convertTimeToMilliseconds from "$/time/convert_time_to_milliseconds"
import ConsultationTimerManager from "$@/helpers/consultation_timer_manager"
import Component from "./chat_window.vue"

describe("Component: consultation/chat_window", () => {
	it("should request to start consultation", async() => {
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
		const wrapper = shallowMount<any>(Component, {
			"props": {
				"chatMessages": fakeChatMessage,
				"consultation": fakeConsultation
			}
		})

		const userController = wrapper.findComponent({ "name": "UserController" })
		await userController.trigger("start-consultation")
		await flushPromises()

		const consultationHeader = wrapper.find(".selected-consultation-header")
		expect(consultationHeader.exists()).toBeTruthy()
		expect(consultationHeader.html()).toContain("5m")
		const events = wrapper.emitted("updatedConsultationAttributes")
		expect(events).toHaveLength(1)
		const castFetch = fetch as jest.Mock<any, any>
		const [ [ firstRequest ] ] = castFetch.mock.calls
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
	})

	it("should automatically terminate the consultation", async() => {
		const scheduledStartAt = new Date()
		fetchMock.mockResponseOnce("", { "status": RequestEnvironment.status.NO_CONTENT })
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
		await wrapper.setProps({
			"chatMessages": fakeChatMessage,
			"consultation": {
				...fakeConsultation,
				"startedAt": new Date(Date.now() - convertTimeToMilliseconds("00:00:01"))
			}
		})
		ConsultationTimerManager.nextInterval()
		await flushPromises()

		const consultationHeader = wrapper.find(".selected-consultation-header")
		expect(consultationHeader.exists()).toBeTruthy()
		expect(consultationHeader.html()).toContain("0m")
		const events = wrapper.emitted("updatedConsultationAttributes")
		expect(events).toHaveLength(2)
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
		expect(secondRequest).toHaveProperty("method", "PATCH")
		expect(secondRequest).toHaveProperty("url", "/api/consultation/1")
		const secondRequestBody = await secondRequest.json()
		expect(secondRequestBody).toHaveProperty("data.attributes.actionTaken", null)
		expect(secondRequestBody).not.toHaveProperty("data.attributes.finishedAt", null)
		expect(secondRequestBody).toHaveProperty("data.attributes.reason", "")
		expect(secondRequestBody).toHaveProperty(
			"data.attributes.scheduledStartAt",
			scheduledStartAt.toJSON()
		)
		expect(secondRequestBody).not.toHaveProperty("data.attributes.startedAt", null)
		expect(secondRequestBody).toHaveProperty("data.id", "1")
		expect(secondRequestBody).toHaveProperty("data.type", "consultation")
	})
})
