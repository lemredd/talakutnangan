import { ref, readonly, nextTick } from "vue"
import { shallowMount, flushPromises } from "@vue/test-utils"

import type { DeserializedConsultationResource } from "$/types/documents/consultation"

import { CHAT_MESSAGE_ACTIVITY } from "$@/constants/provided_keys"

import RequestEnvironment from "$/singletons/request_environment"
import ConsultationTimerManager from "$@/helpers/consultation_timer_manager"

import Component from "./user_controller.vue"

describe("Component: consultation/chat_window/user_controller", () => {
	describe("States", () => {
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
						"scheduledStartAt": new Date("2022-10-04 10:00"),
						"startedAt": new Date("2022-10-04 10:01"),
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
						"scheduledStartAt": new Date("2022-10-04 10:00"),
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
						"scheduledStartAt": new Date("2022-10-04 10:00"),
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
	})

	describe("Text communication", () => {
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
				"scheduledStartAt": new Date("2022-10-04 10:00"),
				"startedAt": new Date("2022-10-04 10:01"),
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
			await nextTick()
			const messageInputBox = wrapper.find(".message-box input")
			ConsultationTimerManager.listenConsultationTimeEvent(
				resource,
				"restartTime",
				mockRestart
			)

			await nextTick()
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

		it("can send upon pressing send button", async() => {
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
				"scheduledStartAt": new Date("2022-10-04 10:00"),
				"startedAt": new Date("2022-10-04 10:01"),
				"type": "consultation"
			} as DeserializedConsultationResource

			const wrapper = shallowMount<any>(Component, {
				"global": {
					"provide": {
						[CHAT_MESSAGE_ACTIVITY]: readonly(ref({
							"id": userID,
							"receivedMessageAt": new Date("2022-10-04 10:00")
						}))
					}
				},
				"props": {
					"consultation": resource
				}
			})
			const messageInputBox = wrapper.find(".message-box input")
			const sendBtn = wrapper.find(".send-btn")
			ConsultationTimerManager.listenConsultationTimeEvent(
				resource,
				"restartTime",
				mockRestart
			)

			await messageInputBox.setValue(message)
			await sendBtn.trigger("click")
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

	describe("Sending files", () => {
		it("can toggle file upload component", async() => {
			fetchMock.mockResponseOnce("", { "status": RequestEnvironment.status.NO_CONTENT })
			fetchMock.mockResponseOnce("", { "status": RequestEnvironment.status.NO_CONTENT })
			const userID = "1"
			const resource = {
				"actionTaken": null,
				"deletedAt": null,
				"finishedAt": null,
				"id": "1",
				"reason": "",
				"scheduledStartAt": new Date("2022-10-04 10:00"),
				"startedAt": new Date("2022-10-04 10:01"),
				"type": "consultation"
			} as DeserializedConsultationResource

			const wrapper = shallowMount<any>(Component, {
				"global": {
					"provide": {
						[CHAT_MESSAGE_ACTIVITY]: readonly(ref({
							"id": userID,
							"receivedMessageAt": new Date("2022-10-04 10:02")
						}))
					}
				},
				"props": {
					"consultation": resource
				}
			})
			const fileUpload = wrapper.find(".file-upload")
			const addImageBtn = wrapper.find(".add-file-btn")

			expect(fileUpload.exists()).toBeTruthy()

			await addImageBtn.trigger("click")
			expect(fileUpload.attributes("isshown")).toBeTruthy()

			await fileUpload.trigger("close")
			expect(fileUpload.attributes("isshown")).toBe("false")
		})

		it("can toggle image upload component", async() => {
			fetchMock.mockResponseOnce("", { "status": RequestEnvironment.status.NO_CONTENT })
			fetchMock.mockResponseOnce("", { "status": RequestEnvironment.status.NO_CONTENT })
			const userID = "1"
			const resource = {
				"actionTaken": null,
				"deletedAt": null,
				"finishedAt": null,
				"id": "1",
				"reason": "",
				"scheduledStartAt": new Date("2022-10-04 10:00"),
				"startedAt": new Date("2022-10-04 10:01"),
				"type": "consultation"
			} as DeserializedConsultationResource

			const wrapper = shallowMount<any>(Component, {
				"global": {
					"provide": {
						[CHAT_MESSAGE_ACTIVITY]: readonly(ref({
							"id": userID,
							"receivedMessageAt": new Date("2022-10-04 10:02")
						}))
					}
				},
				"props": {
					"consultation": resource
				}
			})
			const fileUpload = wrapper.find(".image-upload")
			const addImageBtn = wrapper.find(".add-image-btn")

			expect(fileUpload.exists()).toBeTruthy()

			await addImageBtn.trigger("click")
			expect(fileUpload.attributes("isshown")).toBeTruthy()

			await fileUpload.trigger("close")
			expect(fileUpload.attributes("isshown")).toBe("false")
		})
	})
})
