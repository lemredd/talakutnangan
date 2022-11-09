/* eslint-disable max-lines */
import { mount } from "@vue/test-utils"

import Page from "./form.page.vue"

describe("Page: Consultation/form", () => {
	it("can display consultation details", () => {
		const consultant = {
			"data": {
				"id": 0,
				"name": "Consultant Name"
			}
		}
		const consultantRole = {
			"data": {
				"name": "Consultant Role"
			}
		}
		const chatMessageActivities = {
			"data": [
				{
					"user": consultant
				},
				{
					"user": {
						"data": {
							"id": 1,
							"name": "Consulter Name"
						}
					}
				}
			]
		}

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
									consultant,
									consultantRole,
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
		const consultantNameField = wrapper.find(".consultant")
		const consultantRoleField = wrapper.find(".consultant-role")
		const consulterField = wrapper.find(".consulters")
		const reasonField = wrapper.find(".reason")
		const scheduledStartAtField = wrapper.find(".scheduled-start")
		const startedAtField = wrapper.find(".actual-start")
		const fields = [
			consultantNameField,
			consultantRoleField,
			consulterField,
			reasonField,
			scheduledStartAtField,
			startedAtField
		]

		fields.forEach(field => {
			expect(field.exists()).toBeTruthy()
			expect(field.text()).not.toEqual("")
		})

		const consulters = consulterField.findAll(".consulter")
		expect(consulters).not.toHaveLength(0)
		consulters.forEach((element, index) => {
			expect(element.exists()).toBeTruthy()
			expect(element.text()).not.toEqual(consultant.data.name)
			expect(element.text()).toEqual(chatMessageActivities.data[index + 1].user.data.name)
		})
	})

	describe("chat messages", () => {
		it("can display text messages properly", () => {
			const consultant = {
				"data": {
					"id": 0,
					"name": "Consultant Name"
				}
			}
			const consultantRole = {
				"data": {
					"name": "Consultant Role"
				}
			}
			const chatMessageActivities = {
				"data": [
					{
						"user": consultant
					},
					{
						"user": {
							"data": {
								"id": 1,
								"name": "Consulter Name"
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
			const wrapper = mount(Page, {
				"global": {
					"provide": {
						"pageContext": {
							"pageProps": {
								chatMessageActivities,
								chatMessages,
								"consultation": {
									"data": {
										consultant,
										consultantRole,
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
			const consultant = {
				"data": {
					"id": 0,
					"name": "Consultant Name"
				}
			}
			const consultantRole = {
				"data": {
					"name": "Consultant Role"
				}
			}
			const chatMessageActivities = {
				"data": [
					{
						"user": consultant
					},
					{
						"user": {
							"data": {
								"id": 1,
								"name": "Consulter Name"
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
			const wrapper = mount(Page, {
				"global": {
					"provide": {
						"pageContext": {
							"pageProps": {
								chatMessageActivities,
								chatMessages,
								"consultation": {
									"data": {
										consultant,
										consultantRole,
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
			const consultant = {
				"data": {
					"id": 0,
					"name": "Consultant Name"
				}
			}
			const consultantRole = {
				"data": {
					"name": "Consultant Role"
				}
			}
			const chatMessageActivities = {
				"data": [
					{
						"user": consultant
					},
					{
						"user": {
							"data": {
								"id": 1,
								"name": "Consulter Name"
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
			const wrapper = mount(Page, {
				"global": {
					"provide": {
						"pageContext": {
							"pageProps": {
								chatMessageActivities,
								chatMessages,
								"consultation": {
									"data": {
										consultant,
										consultantRole,
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
			const consultant = {
				"data": {
					"id": 0,
					"name": "Consultant Name"
				}
			}
			const consultantRole = {
				"data": {
					"name": "Consultant Role"
				}
			}
			const chatMessageActivities = {
				"data": [
					{
						"user": consultant
					},
					{
						"user": {
							"data": {
								"id": 1,
								"name": "Consulter Name"
							}
						}
					}
				]
			}

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
										consultant,
										consultantRole,
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
			const consultant = {
				"data": {
					"id": 0,
					"name": "Consultant Name",
					"signature": {
						"data": {
							"fileContents": "/sample/url"
						}
					}
				}
			}
			const consultantRole = {
				"data": {
					"name": "Consultant Role"
				}
			}
			const chatMessageActivities = {
				"data": [
					{
						"user": consultant
					},
					{
						"user": {
							"data": {
								"id": 1,
								"name": "Consulter Name",
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
										consultant,
										consultantRole,
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
			const consultantSignature = signatures.find(".consultant-signature")
			const consultantSignatureImg = consultantSignature.find("img")
			const consulterSignature = signatures.find(".consulter-signature")
			const consulterSignatureImg = consulterSignature.findAll("img")

			expect(signatures.exists()).toBeTruthy()
			expect(consultantSignature.exists()).toBeTruthy()
			expect(consulterSignature.exists()).toBeTruthy()
			expect(consultantSignatureImg.attributes("src")).toBeDefined()
			consulterSignatureImg.forEach(img => expect(img.attributes("src")).toBeDefined())
		})
	})
})
