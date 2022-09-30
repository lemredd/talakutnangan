import { ref, readonly } from "vue"
import { shallowMount, flushPromises } from "@vue/test-utils"

import type { DeserializedConsultationResource } from "$/types/documents/consultation"

import { CHAT_MESSAGE_ACTIVITY } from "$@/constants/provided_keys"

import RequestEnvironment from "$/singletons/request_environment"
import ConsultationTimerManager from "$@/helpers/consultation_timer_manager"
import Component from "./user_controller.vue"

describe("Component: consultation/chat_window/user_controller", () => {
	it("should show main controllers if ongoing", () => {
		const wrapper = shallowMount<any>(Component, {
			"global": {
				"provide": {
					[CHAT_MESSAGE_ACTIVITY]: readonly(ref({ "id": "1" }))
				}
			},
			"props": {
				"consultation": {
					"actionTaken": null,
					"deletedAt": null,
					"finishedAt": null,
					"id": "1",
					"reason": "",
					"scheduledStartAt": new Date(),
					"startedAt": new Date(),
					"type": "consultation"
				} as DeserializedConsultationResource
			}
		})

		const wideControl = wrapper.find(".wide-control")
		const leftControls = wrapper.find(".left-controls")
		const messageBox = wrapper.find(".message-box")
		const rightControls = wrapper.find(".right-controls")

		expect(wideControl.exists()).toBeFalsy()
		expect(leftControls.exists()).toBeTruthy()
		expect(messageBox.exists()).toBeTruthy()
		expect(rightControls.exists()).toBeTruthy()
	})

	it("should show start button if consultation will start", () => {
		const wrapper = shallowMount<any>(Component, {
			"global": {
				"provide": {
					[CHAT_MESSAGE_ACTIVITY]: readonly(ref({ "id": "1" }))
				}
			},
			"props": {
				"consultation": {
					"actionTaken": null,
					"deletedAt": null,
					"finishedAt": null,
					"id": "1",
					"reason": "",
					"scheduledStartAt": new Date(),
					"startedAt": null,
					"type": "consultation"
				}
			}
		})

		const wideControl = wrapper.find(".wide-control")
		const leftControls = wrapper.find(".left-controls")
		const messageBox = wrapper.find(".message-box")
		const rightControls = wrapper.find(".right-controls")

		expect(wideControl.exists()).toBeTruthy()
		expect(leftControls.exists()).toBeFalsy()
		expect(messageBox.exists()).toBeFalsy()
		expect(rightControls.exists()).toBeFalsy()
	})

	it("should start upon pressing the button", async() => {
		const wrapper = shallowMount<any>(Component, {
			"global": {
				"provide": {
					[CHAT_MESSAGE_ACTIVITY]: readonly(ref({ "id": "1" }))
				}
			},
			"props": {
				"consultation": {
					"actionTaken": null,
					"deletedAt": null,
					"finishedAt": null,
					"id": "1",
					"reason": "",
					"scheduledStartAt": new Date(),
					"startedAt": null,
					"type": "consultation"
				}
			}
		})

		const startButton = wrapper.find(".wide-control .start")
		await startButton.trigger("click")

		const events = wrapper.emitted("startConsultation")
		expect(events).toHaveLength(1)
	})

	it("can send upon pressing enter", async() => {
		fetchMock.mockResponseOnce("", { "status": RequestEnvironment.status.NO_CONTENT })
		fetchMock.mockResponseOnce("", { "status": RequestEnvironment.status.NO_CONTENT })
		const message = "Hello"
		const userID = "1"
		const mockRestart = jest.fn()
		const resource = {
			"actionTaken": null,
			"deletedAt": null,
			"finishedAt": null,
			"id": "1",
			"reason": "",
			"scheduledStartAt": new Date(),
			"startedAt": new Date(),
			"type": "consultation"
		} as DeserializedConsultationResource

		const wrapper = shallowMount<any>(Component, {
			"global": {
				"provide": {
					[CHAT_MESSAGE_ACTIVITY]: readonly(ref({
						"id": userID,
						"receivedMessageAt": new Date()
					}))
				}
			},
			"props": {
				"consultation": resource
			}
		})
		const messageInputBox = wrapper.find(".message-box input")
		ConsultationTimerManager.listenConsultationTimeEvent(
			resource,
			"restartTime",
			mockRestart
		)

		await messageInputBox.setValue(message)
		await messageInputBox.trigger("keyup.enter")
		await flushPromises()

		expect(mockRestart).toHaveBeenCalled()
		const castMessageInputBox = messageInputBox.element as HTMLInputElement
		expect(castMessageInputBox.value).toBe("")
		const castFetch = fetch as jest.Mock<any, any>
		const [ [ firstRequest ] ] = castFetch.mock.calls
		expect(firstRequest).toHaveProperty("method", "POST")
		expect(firstRequest).toHaveProperty("url", "/api/chat_message")
		const firstRequestBody = await firstRequest.json()
		expect(firstRequestBody).toHaveProperty("data.type", "chat_message")
		expect(firstRequestBody).toHaveProperty(
			"data.relationships.chatMessageActivity.data.id",
			userID
		)
	})
})
