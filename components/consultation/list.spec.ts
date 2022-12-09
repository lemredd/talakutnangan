import { shallowMount } from "@vue/test-utils"

import { DeserializedConsultationResource } from "$/types/documents/consultation"
import type {
	DeserializedChatMessageActivityListDocument
} from "$/types/documents/chat_message_activity"

import { BODY_CLASSES } from "$@/constants/provided_keys"

import Component from "./list.vue"

describe("Component: consultation/list", () => {
	it("should be able to add consultation for student", () => {
		const wrapper = shallowMount<any>(Component, {
			"global": {
				"provide": {
					[BODY_CLASSES]: [],
					"pageContext": {
						"pageProps": {
							"userProfile": {
								"data": {
									"kind": "student"
								}
							}
						},
						"urlPathname": "/"
					}
				}
			},
			"props": {
				"chatMessageActivities": {
					"data": []
				},
				"consultations": {
					"data": [
						{
							"id": "1",
							"reason": "Reason A"
						},
						{
							"id": "2",
							"reason": "Reason B"
						}
					]
				},
				"previewMessages": {
					"data": []
				}
			}
		})

		const addConsultationButton = wrapper.find(".add-btn")
		expect(addConsultationButton.exists()).toBeTruthy()
	})

	it("should show multiple chats", () => {
		const wrapper = shallowMount<any>(Component, {
			"global": {
				"provide": {
					[BODY_CLASSES]: [],
					"pageContext": {
						"pageProps": {
							"userProfile": {
								"data": {
									"kind": "student"
								}
							}
						},
						"urlPathname": "/"
					}
				},
				"stubs": {
					"Item": false
				}
			},
			"props": {
				"chatMessageActivities": {
					"data": []
				},
				"consultations": {
					"data": [
						{
							"id": "1",
							"reason": "Reason A"
						},
						{
							"id": "2",
							"reason": "Reason B"
						}
					]
				},
				"previewMessages": {
					"data": []
				}
			}
		})

		const titles = wrapper.findAll(".consultation-title")

		expect(titles[0].text()).toContain("Reason A")
		expect(titles[1].text()).toContain("Reason B")
	})

	it("can determine consultation's chat message activities", () => {
		const chatMessageActivities = {
			"data": [
				{
					"consultation": {
						"data": {
							"id": "1"
						}
					},
					"id": "1",
					"user": {
						"data": {
							"id": "1"
						}
					}
				},
				{
					"consultation": {
						"data": {
							"id": "1"
						}
					},
					"id": "3",
					"user": {
						"data": {
							"id": "2"
						}
					}
				},
				{
					"consultation": {
						"data": {
							"id": "2"
						}
					},
					"id": "3",
					"user": {
						"data": {
							"id": "1"
						}
					}
				},
				{
					"consultation": {
						"data": {
							"id": "2"
						}
					},
					"id": "4",
					"user": {
						"data": {
							"id": "3"
						}
					}
				}
			]
		} as DeserializedChatMessageActivityListDocument

		const wrapper = shallowMount<any>(Component, {
			"global": {
				"provide": {
					[BODY_CLASSES]: [],
					"pageContext": {
						"pageProps": {
							"userProfile": {
								"data": {
									"kind": "student"
								}
							}
						},
						"urlPathname": "/"
					}
				},
				"stubs": {
					"Item": false
				}
			},
			"props": {
				chatMessageActivities,
				"consultations": {
					"data": [
						{
							"id": "1",
							"reason": "Reason A"
						},
						{
							"id": "2",
							"reason": "Reason B"
						}
					]
				},
				"previewMessages": {
					"data": []
				}
			}
		})

		const items = wrapper.findAllComponents({ "name": "Item" })
		items.forEach(item => {
			const itemActivitiesProp
			= item.props("chatMessageActivities") as DeserializedChatMessageActivityListDocument
			const consultationProp = item.props("consultation") as DeserializedConsultationResource

			itemActivitiesProp.data.forEach(activity => {
				expect(activity.consultation?.data.id).toEqual(consultationProp.id)
			})
		})
	})
})
