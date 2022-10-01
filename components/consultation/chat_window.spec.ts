import { nextTick } from "vue"
import { shallowMount, flushPromises } from "@vue/test-utils"

import type { DeserializedConsultationResource } from "$/types/documents/consultation"
import type { DeserializedChatMessageListDocument } from "$/types/documents/chat_message"

import { BOUND_CONSULTATION_LINK } from "$/constants/template_links"

import specializePath from "$/helpers/specialize_path"
import RequestEnvironment from "$/singletons/request_environment"
import convertTimeToMilliseconds from "$/time/convert_time_to_milliseconds"
import ConsultationTimerManager from "$@/helpers/consultation_timer_manager"
import Component from "./chat_window.vue"

describe("Component: consultation/chat_window", () => {
	it("should request to start consultation", async() => {
		const scheduledStartAt = new Date()
		fetchMock.mockResponseOnce("", { "status": RequestEnvironment.status.NO_CONTENT })
		const id = "1"
		const fakeConsultation = {
			"actionTaken": null,
			"finishedAt": null,
			id,
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
		expect(firstRequest).toHaveProperty("url", specializePath(BOUND_CONSULTATION_LINK, { id }))
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
		const id = "1"
		const fakeConsultation = {
			"actionTaken": null,
			"finishedAt": null,
			id,
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
		const updatedFakeConsultation = {
			...fakeConsultation,
			"startedAt": new Date(Date.now() - convertTimeToMilliseconds("00:00:01"))
		} as DeserializedConsultationResource
		await wrapper.setProps({
			"chatMessages": fakeChatMessage,
			"consultation": updatedFakeConsultation
		})
		ConsultationTimerManager.forceFinish(updatedFakeConsultation)
		await flushPromises()

		const consultationHeader = wrapper.find(".selected-consultation-header")
		expect(consultationHeader.exists()).toBeTruthy()
		expect(consultationHeader.html()).toContain("0m")
		const events = wrapper.emitted("updatedConsultationAttributes")
		expect(events).toHaveLength(2)
		const castFetch = fetch as jest.Mock<any, any>
		const [ [ firstRequest ], [ secondRequest ] ] = castFetch.mock.calls
		expect(firstRequest).toHaveProperty("method", "PATCH")
		expect(firstRequest).toHaveProperty("url", specializePath(BOUND_CONSULTATION_LINK, { id }))
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
		expect(secondRequest).toHaveProperty("url", specializePath(BOUND_CONSULTATION_LINK, { id }))
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

	it("should continue to started consultation", async() => {
		const scheduledStartAt = new Date(Date.now() - convertTimeToMilliseconds("00:00:02"))
		fetchMock.mockResponseOnce("", { "status": RequestEnvironment.status.NO_CONTENT })
		const fakeConsultation = {
			"actionTaken": null,
			"finishedAt": null,
			"id": "1",
			"reason": "",
			scheduledStartAt,
			"startedAt": scheduledStartAt,
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

		await nextTick()

		const consultationHeader = wrapper.find(".selected-consultation-header")
		expect(consultationHeader.exists()).toBeTruthy()
		expect(consultationHeader.html()).toContain("5m")
	})

	it("should start consultation on other source's update", async() => {
		const scheduledStartAt = new Date(Date.now() - convertTimeToMilliseconds("00:00:02"))
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

		await wrapper.setProps({
			"consultation": {
				...fakeConsultation,
				"startedAt": new Date(Date.now() - convertTimeToMilliseconds("00:05:00"))
			}
		})
		ConsultationTimerManager.nextInterval()
		await nextTick()

		const consultationHeader = wrapper.find(".selected-consultation-header")
		expect(consultationHeader.exists()).toBeTruthy()
		expect(consultationHeader.html()).toContain("4m")
		expect(consultationHeader.html()).toContain("59s")
	})

	it("should restart the timer", async() => {
		const scheduledStartAt = new Date()
		fetchMock.mockResponseOnce("", { "status": RequestEnvironment.status.NO_CONTENT })
		fetchMock.mockResponseOnce("", { "status": RequestEnvironment.status.NO_CONTENT })
		const id = "1"
		const fakeConsultation = {
			"actionTaken": null,
			"finishedAt": null,
			id,
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
		const updatedFakeConsultation = {
			...fakeConsultation,
			"startedAt": new Date(Date.now() - convertTimeToMilliseconds("00:00:01"))
		} as DeserializedConsultationResource
		await wrapper.setProps({ "consultation": updatedFakeConsultation })
		ConsultationTimerManager.restartTimerFor(updatedFakeConsultation)
		await nextTick()

		const consultationHeader = wrapper.find(".selected-consultation-header")
		expect(consultationHeader.exists()).toBeTruthy()
		expect(consultationHeader.html()).toContain("5m")
		const events = wrapper.emitted("updatedConsultationAttributes")
		expect(events).toHaveLength(1)
		const castFetch = fetch as jest.Mock<any, any>
		const [ [ firstRequest ] ] = castFetch.mock.calls
		expect(firstRequest).toHaveProperty("method", "PATCH")
		expect(firstRequest).toHaveProperty("url", specializePath(BOUND_CONSULTATION_LINK, { id }))
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
})
