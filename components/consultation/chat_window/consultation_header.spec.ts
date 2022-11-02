import { flushPromises, shallowMount } from "@vue/test-utils"

import type { DeserializedConsultationResource } from "$/types/documents/consultation"
import type { DeserializedChatMessageListDocument } from "$/types/documents/chat_message"

import RequestEnvironment from "$/singletons/request_environment"
import convertTimeToMilliseconds from "$/time/convert_time_to_milliseconds"
import convertMStoTimeObject from "$@/helpers/convert_milliseconds_to_full_time_object"

import Component from "./consultation_header.vue"

describe("Component: chat window/consultation header", () => {
	describe("remaining time", () => {
		it("should continue to started consultation", async() => {
			fetchMock.mockResponseOnce(
				JSON.stringify({
					"data": [],
					"meta": {}
				}),
				{ "status": RequestEnvironment.status.OK }
			)

			const dateNow = new Date("2022-10-20 10:00:00")
			const scheduledStartAt
			= new Date(dateNow.valueOf() - convertTimeToMilliseconds("00:00:02"))
			const consultant = {
				"data": {
					"id": "10",
					"kind": "reachable_employee",
					"type": "user"
				}
			}
			const remainingMilliseconds = convertTimeToMilliseconds("00:05:00")
			const remainingTime = convertMStoTimeObject(remainingMilliseconds)
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
				"global": {
					"provide": {
						"pageContext": {
							"pageProps": {
								"userProfile": consultant
							}
						}
					}
				},
				"props": {
					"chatMessages": fakeChatMessage,
					"consultation": fakeConsultation,
					"modelValue": "",
					"receivedErrors": [],
					remainingTime
				}
			})
			await flushPromises()

			const selectedConsultationRemainingTime
			= wrapper.find(".selected-consultation-remaining-time")
			expect(selectedConsultationRemainingTime.html()).toContain("5m")
		})

		it("should start consultation on other source's update", async() => {
			fetchMock.mockResponseOnce(
				JSON.stringify({
					"data": [],
					"meta": {}
				}),
				{ "status": RequestEnvironment.status.OK }
			)

			const scheduledStartAt = new Date(Date.now() - convertTimeToMilliseconds("00:00:02"))
			const remainingMilliseconds = convertTimeToMilliseconds("00:05:00")
			const remainingTime = convertMStoTimeObject(remainingMilliseconds)
			const consultant = {
				"data": {
					"id": "10",
					"kind": "reachable_employee",
					"type": "user"
				}
			}
			const fakeConsultation = {
				"actionTaken": null,
				consultant,
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
				"global": {
					"provide": {
						"pageContext": {
							"pageProps": {
								"userProfile": consultant
							}
						}
					}
				},
				"props": {
					"chatMessages": fakeChatMessage,
					"consultation": fakeConsultation,
					"modelValue": "",
					"receivedErrors": [],
					remainingTime
				}
			})

			await wrapper.setProps({
				"consultation": {
					...fakeConsultation,
					"startedAt": new Date(Date.now() - convertTimeToMilliseconds("00:05:00"))
				},
				"remainingTime": convertMStoTimeObject(convertTimeToMilliseconds("00:04:59"))
			})

			const consultationHeader = wrapper.find(".selected-consultation-header")
			expect(consultationHeader.exists()).toBeTruthy()
			expect(consultationHeader.html()).toContain("4m")
			expect(consultationHeader.html()).toContain("59s")
		})
	})

	describe("file fetching", () => {
		it.todo("can fetch independent file messages")
	})
})
