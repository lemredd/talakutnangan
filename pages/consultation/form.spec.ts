/* eslint-disable max-lines */
import RequestEnvironment from "$/singletons/request_environment"

import { mount } from "@vue/test-utils"

import Page from "./form.page.vue"

describe("Page: Consultation/form", () => {
	describe("chat messages", () => {
		it("can display text messages properly", () => {
			const consultor = {
				"data": {
					"id": 0,
					"name": "Consultor Name"
				}
			}
			const consultorRole = {
				"data": {
					"name": "Consultor Role"
				}
			}
			const chatMessageActivities = {
				"data": [
					{
						"user": consultor
					},
					{
						"user": {
							"data": {
								"id": 1,
								"name": "Consultee Name"
							}
						}
					}
				]
			}
			const chatMessages = {
				"data": [
					{
						"createdAt": new Date("2022-10-04 10:02"),
						"data": {
							"value": "text message"
						},
						"kind": "text",
						"user": chatMessageActivities.data[0].user
					}
				]
			}

			fetchMock.mockResponseOnce(
				JSON.stringify({
					"data": [],
					"meta": {
						"count": 0
					}
				}),
				{ "status": RequestEnvironment.status.OK }
			)

			const wrapper = mount(Page, {
				"global": {
					"provide": {
						"pageContext": {
							"pageProps": {
								chatMessageActivities,
								chatMessages,
								"consultation": {
									"data": {
										consultor,
										consultorRole,
										"reason": "Reason",
										"scheduledStartAt": new Date("2022-10-04 10:00"),
										"startedAt": new Date("2022-10-04 10:01")
									}
								}
							}
						}
					}
				}
			})
			const chatMessagesList = wrapper.find(".chat-messages")
			const dateAndOwner = chatMessagesList.findAll(".date-and-owner-details")
			const textMessages = chatMessagesList.findAll(".text-message")

			dateAndOwner.forEach(detail => expect(detail.text()).not.toEqual(""))
			textMessages.forEach(message => expect(message.text()).toContain(":"))
		})

		it("can display status messages properly", () => {
			const consultor = {
				"data": {
					"id": 0,
					"name": "Consultor Name"
				}
			}
			const consultorRole = {
				"data": {
					"name": "Consultor Role"
				}
			}
			const chatMessageActivities = {
				"data": [
					{
						"user": consultor
					},
					{
						"user": {
							"data": {
								"id": 1,
								"name": "Consultee Name"
							}
						}
					}
				]
			}
			const chatMessages = {
				"data": [
					{
						"createdAt": new Date("2022-10-04 10:02"),
						"data": {
							"value": "has done something"
						},
						"kind": "status",
						"user": chatMessageActivities.data[0].user
					}
				]
			}

			fetchMock.mockResponseOnce(
				JSON.stringify({
					"data": [],
					"meta": {
						"count": 0
					}
				}),
				{ "status": RequestEnvironment.status.OK }
			)

			const wrapper = mount(Page, {
				"global": {
					"provide": {
						"pageContext": {
							"pageProps": {
								chatMessageActivities,
								chatMessages,
								"consultation": {
									"data": {
										consultor,
										consultorRole,
										"reason": "Reason",
										"scheduledStartAt": new Date("2022-10-04 10:00"),
										"startedAt": new Date("2022-10-04 10:01")
									}
								}
							}
						}
					}
				}
			})
			const chatMessagesList = wrapper.find(".chat-messages")
			const statusMessages = chatMessagesList.findAll(".status-message")
			const dateAndOwner = chatMessagesList.findAll(".date-and-owner-details")

			dateAndOwner.forEach(detail => expect(detail.text()).not.toEqual(""))
			statusMessages.forEach(message => {
				expect(message.text()).toContain(chatMessages.data[0].data.value)
			})
		})

		it("can display file messages properly", () => {
			const consultor = {
				"data": {
					"id": 0,
					"name": "Consultor Name"
				}
			}
			const consultorRole = {
				"data": {
					"name": "Consultor Role"
				}
			}
			const chatMessageActivities = {
				"data": [
					{
						"user": consultor
					},
					{
						"user": {
							"data": {
								"id": 1,
								"name": "Consultee Name"
							}
						}
					}
				]
			}
			const fileContents = "/sample/url"
			const chatMessages = {
				"data": [
					{
						"attachedChatFile": {
							"data": {
								fileContents
							}
						},
						"createdAt": new Date("2022-10-04 10:02"),
						"kind": "file",
						"user": chatMessageActivities.data[0].user
					}
				]
			}

			fetchMock.mockResponseOnce(
				JSON.stringify({
					"data": [],
					"meta": {
						"count": 0
					}
				}),
				{ "status": RequestEnvironment.status.OK }
			)

			const wrapper = mount(Page, {
				"global": {
					"provide": {
						"pageContext": {
							"pageProps": {
								chatMessageActivities,
								chatMessages,
								"consultation": {
									"data": {
										consultor,
										consultorRole,
										"reason": "Reason",
										"scheduledStartAt": new Date("2022-10-04 10:00"),
										"startedAt": new Date("2022-10-04 10:01")
									}
								}
							}
						}
					}
				}
			})
			const chatMessagesList = wrapper.find(".chat-messages")
			const fileMessages = chatMessagesList.findAll(".file-message")
			const dateAndOwner = chatMessagesList.findAll(".date-and-owner-details")

			dateAndOwner.forEach(detail => expect(detail.text()).not.toEqual(""))
			fileMessages.forEach(message => {
				expect(message.text()).toContain("sent an attachment")
				const link = message.find("a")
				expect(link.attributes("href")).toEqual(fileContents)
			})
		})
	})

	describe("printing", () => {
		it("can print the page on click", async() => {
			const consultor = {
				"data": {
					"id": 0,
					"name": "Consultor Name"
				}
			}
			const consultorRole = {
				"data": {
					"name": "Consultor Role"
				}
			}
			const chatMessageActivities = {
				"data": [
					{
						"user": consultor
					},
					{
						"user": {
							"data": {
								"id": 1,
								"name": "Consultee Name"
							}
						}
					}
				]
			}

			fetchMock.mockResponseOnce(
				JSON.stringify({
					"data": [],
					"meta": {
						"count": 0
					}
				}),
				{ "status": RequestEnvironment.status.OK }
			)

			const wrapper = mount(Page, {
				"global": {
					"provide": {
						"pageContext": {
							"pageProps": {
								chatMessageActivities,
								"chatMessages": {
									"data": []
								},
								"consultation": {
									"data": {
										consultor,
										consultorRole,
										"finishedAt": new Date("2022-10-04 10:01"),
										"reason": "Reason",
										"scheduledStartAt": new Date("2022-10-04 10:00")
									}
								}
							}
						}
					}
				}
			})
			const printBtn = wrapper.find(".print-btn")

			expect(printBtn.exists()).toBeTruthy()

			global.window.print = jest.fn()
			await printBtn.trigger("click")

			expect(global.window.print).toBeCalled()
		})
	})

	describe("signatures", () => {
		it("can show signatures if finished", () => {
			const consultor = {
				"data": {
					"id": 0,
					"name": "Consultor Name",
					"signature": {
						"data": {
							"fileContents": "/sample/url"
						}
					}
				}
			}
			const consultorRole = {
				"data": {
					"name": "Consultor Role"
				}
			}
			const chatMessageActivities = {
				"data": [
					{
						"user": consultor
					},
					{
						"user": {
							"data": {
								"id": 1,
								"name": "Consultee Name",
								"signature": {
									"data": {
										"fileContents": "/sample/url"
									}
								}
							}
						}
					}
				]
			}

			fetchMock.mockResponseOnce(
				JSON.stringify({
					"data": [],
					"meta": {
						"count": 0
					}
				}),
				{ "status": RequestEnvironment.status.OK }
			)

			const wrapper = mount(Page, {
				"global": {
					"provide": {
						"pageContext": {
							"pageProps": {
								chatMessageActivities,
								"chatMessages": {
									"data": []
								},
								"consultation": {
									"data": {
										consultor,
										consultorRole,
										"finishedAt": new Date("2022-10-04 15:00"),
										"reason": "Reason",
										"scheduledStartAt": new Date("2022-10-04 10:00"),
										"startedAt": new Date("2022-10-04 10:00")
									}
								}
							}
						}
					}
				}
			})
			const signatures = wrapper.find(".signatures")
			const consultorSignature = signatures.find(".consultor-signature")
			const consultorSignatureImg = consultorSignature.find("img")
			const consulteeSignature = signatures.find(".consultee-signature")
			const consulteeSignatureImg = consulteeSignature.findAll("img")

			expect(signatures.exists()).toBeTruthy()
			expect(consultorSignature.exists()).toBeTruthy()
			expect(consulteeSignature.exists()).toBeTruthy()
			expect(consultorSignatureImg.attributes("src")).toBeDefined()
			consulteeSignatureImg.forEach(img => expect(img.attributes("src")).toBeDefined())
		})
	})
})
