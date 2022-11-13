/* eslint-disable max-lines */
import { nextTick } from "vue"
import { shallowMount, flushPromises } from "@vue/test-utils"

import type { DeserializedConsultationResource } from "$/types/documents/consultation"
import type { DeserializedChatMessageListDocument } from "$/types/documents/chat_message"

import { JSON_API_MEDIA_TYPE } from "$/types/server"

import { CONSULTATION_LINK } from "$/constants/template_links"

import specializePath from "$/helpers/specialize_path"
import RequestEnvironment from "$/singletons/request_environment"
import convertTimeToMilliseconds from "$/time/convert_time_to_milliseconds"
import ConsultationTimerManager from "$@/helpers/consultation_timer_manager"

import Component from "./chat_window.vue"

describe("Component: consultation/chat_window", () => {
	describe("consultation states", () => {
		describe("before", () => {
			it("can toggle consultation list state", async() => {
				fetchMock.mockResponseOnce("", { "status": RequestEnvironment.status.NO_CONTENT })

				const scheduledStartAt = new Date()
				const consultant = {
					"data": {
						"id": "10",
						"kind": "reachable_employee",
						"type": "user"
					}
				}
				const id = "1"
				const fakeConsultation = {
					"actionTaken": null,
					"consultant": {
						"data": {
							"id": "1",
							"type": "user"
						}
					},
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
						"isConsultationListShown": false
					}
				})
				const toggleListBtn = wrapper.find(".toggle-list-btn")
				expect(toggleListBtn.exists()).toBeTruthy()

				await toggleListBtn.trigger("click")
				const emits = wrapper.emitted()
				expect(emits).toHaveProperty("toggleConsultationList")
			})

			it("should request to start consultation", async() => {
				fetchMock.mockResponseOnce("", { "status": RequestEnvironment.status.NO_CONTENT })

				const scheduledStartAt = new Date()
				const consultant = {
					"data": {
						"id": "10",
						"kind": "reachable_employee",
						"type": "user"
					}
				}
				const id = "1"
				const fakeConsultation = {
					"actionTaken": null,
					"consultant": {
						"data": {
							"id": "1",
							"type": "user"
						}
					},
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
						"isConsultationListShown": false
					}
				})

				const userController = wrapper.findComponent({ "name": "UserController" })
				await userController.trigger("start-consultation")
				await flushPromises()

				const events = wrapper.emitted("updatedConsultationAttributes")
				expect(events).toHaveLength(1)
				const castFetch = fetch as jest.Mock<any, any>
				const [ [ firstRequest ] ] = castFetch.mock.calls
				expect(firstRequest).toHaveProperty("method", "PATCH")
				expect(firstRequest).toHaveProperty(
					"url",
					specializePath(CONSULTATION_LINK.bound, { id })
				)
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

			it("can be cancelled by students", async() => {
				fetchMock.mockResponseOnce("", { "status": RequestEnvironment.status.NO_CONTENT })

				const scheduledStartAt = new Date()
				const userProfile = {
					"data": {
						"id": "10",
						"kind": "student",
						"type": "user"
					}
				}
				const id = "1"
				const fakeConsultation = {
					"actionTaken": null,
					"consultant": {
						"data": {
							"id": "1",
							"type": "user"
						}
					},
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
					"global": {
						"provide": {
							"pageContext": {
								"pageProps": {
									userProfile
								}
							}
						}
					},
					"props": {
						"chatMessages": fakeChatMessage,
						"consultation": fakeConsultation,
						"isConsultationListShown": false
					}
				})

				const consultationHeader = wrapper.findComponent({ "name": "ConsultationHeader" })
				await consultationHeader.vm.$emit("cancelConsultation")

				const mockedFetch = fetch as jest.Mock<any, any>
				const [ [ request ] ] = mockedFetch.mock.calls
				expect(request).toHaveProperty("method", "DELETE")
				expect(request).toHaveProperty(
					"url",
					specializePath(CONSULTATION_LINK.unbound, { })
				)
			})
		})

		describe("during", () => {
			it("should automatically terminate the consultation", async() => {
				const scheduledStartAt = new Date()
				const consultant = {
					"data": {
						"id": "10",
						"kind": "reachable_employee",
						"type": "user"
					}
				}
				fetchMock.mockResponseOnce("", { "status": RequestEnvironment.status.NO_CONTENT })
				fetchMock.mockResponseOnce("", { "status": RequestEnvironment.status.NO_CONTENT })
				const id = "1"
				const fakeConsultation = {
					"actionTaken": null,
					consultant,
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
						"isConsultationListShown": false
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

				const events = wrapper.emitted("updatedConsultationAttributes")
				expect(events).toHaveLength(2)
				const castFetch = fetch as jest.Mock<any, any>
				const [ [ firstRequest ], [ secondRequest ] ] = castFetch.mock.calls
				expect(firstRequest).toHaveProperty("method", "PATCH")
				expect(firstRequest).toHaveProperty(
					"url",
					specializePath(CONSULTATION_LINK.bound, { id })
				)
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
				expect(secondRequest).toHaveProperty(
					"url",
					specializePath(CONSULTATION_LINK.bound, { id })
				)
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

			it("should restart the timer", async() => {
				jest.useFakeTimers()
				const scheduledStartAt = new Date()
				const consultant = {
					"data": {
						"id": "10",
						"kind": "reachable_employee",
						"type": "user"
					}
				}
				fetchMock.mockResponseOnce("", { "status": RequestEnvironment.status.NO_CONTENT })
				fetchMock.mockResponseOnce("", { "status": RequestEnvironment.status.NO_CONTENT })
				const id = "1"
				const fakeConsultation = {
					"actionTaken": null,
					consultant,
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
						"isConsultationListShown": false
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

				const castedWrapper = wrapper.vm as any
				expect(castedWrapper.remainingTime.minutes).toEqual(5)
				expect(castedWrapper.remainingTime.seconds).toEqual(0)
				ConsultationTimerManager.nextInterval()
				expect(castedWrapper.remainingTime.minutes).toEqual(4)
				expect(castedWrapper.remainingTime.seconds).toEqual(59)

				const events = wrapper.emitted("updatedConsultationAttributes")
				expect(events).toHaveLength(1)
				const castFetch = fetch as jest.Mock<any, any>
				const [ [ firstRequest ] ] = castFetch.mock.calls
				expect(firstRequest).toHaveProperty("method", "PATCH")
				expect(firstRequest).toHaveProperty(
					"url",
					specializePath(CONSULTATION_LINK.bound, { id })
				)
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
				ConsultationTimerManager.clearAllListeners()
			})
		})

		describe("after", () => {
			it("should automatically terminate the consultation", async() => {
				const scheduledStartAt = new Date()
				const consultant = {
					"data": {
						"id": "10",
						"kind": "reachable_employee",
						"type": "user"
					}
				}
				fetchMock.mockResponseOnce("", { "status": RequestEnvironment.status.NO_CONTENT })
				fetchMock.mockResponseOnce("", { "status": RequestEnvironment.status.NO_CONTENT })
				const id = "1"
				const fakeConsultation = {
					"actionTaken": null,
					consultant,
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
						"isConsultationListShown": false
					}
				})

				const userController = wrapper.findComponent({ "name": "UserController" })
				await userController.trigger("start-consultation")
				await flushPromises()
				const firstUpdatedFakeConsultation = {
					...fakeConsultation,
					consultant,
					"startedAt": new Date(Date.now() - convertTimeToMilliseconds("00:00:01"))
				} as DeserializedConsultationResource
				await wrapper.setProps({
					"chatMessages": fakeChatMessage,
					"consultation": firstUpdatedFakeConsultation
				})
				ConsultationTimerManager.forceFinish(firstUpdatedFakeConsultation)
				await flushPromises()

				const secondUpdatedFakeConsultation = {
					...firstUpdatedFakeConsultation,
					"finishedAt": new Date()
				} as DeserializedConsultationResource
				await wrapper.setProps({
					"chatMessages": fakeChatMessage,
					"consultation": secondUpdatedFakeConsultation
				})
				await flushPromises()

				const events = wrapper.emitted("updatedConsultationAttributes")
				expect(events).toHaveLength(2)
				const castFetch = fetch as jest.Mock<any, any>
				const [ [ firstRequest ], [ secondRequest ] ] = castFetch.mock.calls
				expect(firstRequest).toHaveProperty("method", "PATCH")
				expect(firstRequest).toHaveProperty(
					"url",
					specializePath(CONSULTATION_LINK.bound, { id })
				)
				expect(firstRequest.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
				expect(firstRequest.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)

				expect(secondRequest).toHaveProperty("method", "PATCH")
				expect(secondRequest).toHaveProperty(
					"url",
					specializePath(CONSULTATION_LINK.bound, { id })
				)
				expect(secondRequest.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
				expect(secondRequest.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)

				const body = await secondRequest.json()
				expect(body).toHaveProperty("data.relationships.consultant.data.id")
				expect(body).toHaveProperty("meta.doesAllowConflicts")
				ConsultationTimerManager.clearAllListeners()
			})

			it("can be terminated by consultant with action taken", async() => {
				const scheduledStartAt = new Date()
				const consultant = {
					"data": {
						"id": "10",
						"kind": "reachable_employee",
						"type": "user"
					}
				}
				fetchMock.mockResponseOnce("", { "status": RequestEnvironment.status.NO_CONTENT })
				fetchMock.mockResponseOnce("", { "status": RequestEnvironment.status.NO_CONTENT })
				const id = "1"
				const fakeConsultation = {
					"actionTaken": null,
					consultant,
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
						"isConsultationListShown": false
					}
				})

				const userController = wrapper.findComponent({ "name": "UserController" })
				await userController.trigger("start-consultation")
				await flushPromises()
				const firstUpdatedFakeConsultation = {
					...fakeConsultation,
					"startedAt": new Date(Date.now() - convertTimeToMilliseconds("00:00:01"))
				} as DeserializedConsultationResource
				await wrapper.setProps({
					"chatMessages": fakeChatMessage,
					"consultation": firstUpdatedFakeConsultation
				})
				await flushPromises()

				const actionTakenFieldValue = "action taken"
				const header = wrapper.findComponent({ "name": "ConsultationHeader" })
				await header.vm.$emit("update:modelValue", "action taken")
				const secondUpdatedFakeConsultation = {
					...firstUpdatedFakeConsultation,
					"actionTaken": actionTakenFieldValue
				}
				await wrapper.setProps({
					"chatMessages": fakeChatMessage,
					"consultation": secondUpdatedFakeConsultation
				})
				await header.vm.$emit("finishConsultation")
				await flushPromises()

				const events = wrapper.emitted("updatedConsultationAttributes")
				expect(events).toHaveLength(2)

				const castFetch = fetch as jest.Mock<any, any>
				const [ [ firstRequest ], [ secondRequest ] ] = castFetch.mock.calls
				expect(firstRequest).toHaveProperty("method", "PATCH")
				expect(firstRequest).toHaveProperty(
					"url",
					specializePath(CONSULTATION_LINK.bound, { id })
				)
				expect(firstRequest.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
				expect(firstRequest.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)

				expect(secondRequest).toHaveProperty("method", "PATCH")
				expect(secondRequest).toHaveProperty(
					"url",
					specializePath(CONSULTATION_LINK.bound, { id })
				)
				expect(secondRequest.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
				expect(secondRequest.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)
				const body = await secondRequest.json()
				const { actionTaken } = body.data.attributes
				expect(actionTaken).toEqual(actionTakenFieldValue)
				ConsultationTimerManager.clearAllListeners()
			})
		})
	})

	describe("chat messages", () => {
		it("is sorted properly", () => {
			const scheduledStartAt = new Date()
			const consultant = {
				"data": {
					"id": "10",
					"kind": "reachable_employee",
					"type": "user"
				}
			}
			fetchMock.mockResponseOnce("", { "status": RequestEnvironment.status.NO_CONTENT })
			const id = "1"
			const fakeConsultation = {
				"actionTaken": null,
				"consultant": {
					"data": {
						"id": "1",
						"type": "user"
					}
				},
				"finishedAt": null,
				id,
				"reason": "",
				scheduledStartAt,
				"startedAt": null,
				"type": "consultation"
			} as DeserializedConsultationResource
			const fakeChatMessage = {
				"data": [
					{
						"createdAt": new Date("2022-10-4 17:35"),
						"data": {
							"value": "sample text"
						},
						"id": "0"
					},
					{
						"createdAt": new Date("2022-10-4 05:35"),
						"data": {
							"value": "sample text"
						},
						"id": "0"
					}
				]
			}
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
					"isConsultationListShown": false
				}
			})
			const castedWrapper = wrapper.vm as any
			const { sortedMessagesByTime } = castedWrapper

			const [ expectedLastMessage, expectedFirstMessage ] = fakeChatMessage.data
			expect(sortedMessagesByTime[0]).toEqual(expectedFirstMessage)
			expect(sortedMessagesByTime[sortedMessagesByTime.length - 1]).toEqual(expectedLastMessage)
		})
		it("should emit to load previous messages", async() => {
			const scheduledStartAt = new Date()
			const consultant = {
				"data": {
					"id": "10",
					"kind": "reachable_employee",
					"type": "user"
				}
			}
			fetchMock.mockResponseOnce("", { "status": RequestEnvironment.status.NO_CONTENT })
			const id = "1"
			const fakeConsultation = {
				"actionTaken": null,
				"consultant": {
					"data": {
						"id": "1",
						"type": "user"
					}
				},
				"finishedAt": null,
				id,
				"reason": "",
				scheduledStartAt,
				"startedAt": null,
				"type": "consultation"
			} as DeserializedConsultationResource
			const fakeChatMessage = {
				"data": [
					{
						"createdAt": new Date("2022-10-4 17:35"),
						"data": {
							"value": "sample text"
						},
						"id": "0"
					},
					{
						"createdAt": new Date("2022-10-4 05:35"),
						"data": {
							"value": "sample text"
						},
						"id": "0"
					}
				]
			}
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
					"isConsultationListShown": false
				}
			})
			const loadPreviousMessagesBtn = wrapper.find(".load-previous-messages-btn")
			await loadPreviousMessagesBtn.trigger("click")

			const emissions = wrapper.emitted()
			expect(emissions).toHaveProperty("loadPreviousMessages")
		})
	})
})
