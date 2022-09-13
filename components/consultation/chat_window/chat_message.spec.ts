import { shallowMount } from "@vue/test-utils"
import type { TextMessage } from "$/types/message"
import type { DeserializedUserDocument } from "$/types/documents/user"
import type { DeserializedChatMessageResource } from "$/types/documents/chat_message"

import Component from "./chat_message.vue"

describe("Component: consultation/chat_window/chat_message", () => {
	it("should show self's text message properly", () => {
		const CURRENT_TIME = new Date()
		const user = {
			"data": {
				"email": "",
				"id": "1",
				"kind": "reachable_employee",
				"name": "A",
				"prefersDark": true,
				"profilePicture": {
					"data": {
						"fileContents": "http://example.com/image_a",
						"id": "1",
						"type": "profile_picture"
					}
				},
				"type": "user"
			}
		} as DeserializedUserDocument<"profilePicture">
		const textValue = "Hello world!"
		const wrapper = shallowMount<any>(Component, {
			"global": {
				"provide": {
					"pageContext": {
						"pageProps": {
							"userProfile": user
						}
					}
				}
			},
			"props": {
				"chatMessage": {
					"createdAt": CURRENT_TIME,
					"data": {
						"value": textValue
					},
					"id": "0",
					"kind": "text",
					"type": "chat_message",
					"updatedAt": CURRENT_TIME,
					user
				} as DeserializedChatMessageResource<"user"> & TextMessage<"deserialized">
			}
		})

		const messageItem = wrapper.find(".message-item")
		const messageItemName = wrapper.find(".message-item-name")
		const messageItemContent = wrapper.find(".message-item-content")

		expect(messageItem.find(".place-right").exists()).toBeTruthy()
		expect(messageItemName.html()).toContain(user.data.name)
		expect(messageItemContent.html()).toContain(textValue)
	})

	it("should show other's text message properly", () => {
		const CURRENT_TIME = new Date()
		const user = {
			"data": {
				"email": "",
				"id": "1",
				"kind": "reachable_employee",
				"name": "A",
				"prefersDark": true,
				"profilePicture": {
					"data": {
						"fileContents": "http://example.com/image_a",
						"id": "1",
						"type": "profile_picture"
					}
				},
				"type": "user"
			}
		} as DeserializedUserDocument<"profilePicture">
		const other = {
			"data": {
				"email": "",
				"id": "2",
				"kind": "student",
				"name": "B",
				"prefersDark": true,
				"profilePicture": {
					"data": {
						"fileContents": "http://example.com/image_b",
						"id": "2",
						"type": "profile_picture"
					}
				},
				"type": "user"
			}
		} as DeserializedUserDocument<"profilePicture">
		const textValue = "Foo bar!"
		const wrapper = shallowMount<any>(Component, {
			"global": {
				"provide": {
					"pageContext": {
						"pageProps": {
							"userProfile": user
						}
					}
				}
			},
			"props": {
				"chatMessage": {
					"createdAt": CURRENT_TIME,
					"data": {
						"value": textValue
					},
					"id": "0",
					"kind": "text",
					"type": "chat_message",
					"updatedAt": CURRENT_TIME,
					"user": other
				} as DeserializedChatMessageResource<"user"> & TextMessage<"deserialized">
			}
		})

		const messageItem = wrapper.find(".message-item")
		const messageItemName = wrapper.find(".message-item-name")
		const messageItemContent = wrapper.find(".message-item-content")

		expect(messageItem.find(".place-left").exists()).toBeTruthy()
		expect(messageItemName.html()).toContain(other.data.name)
		expect(messageItemContent.html()).toContain(textValue)
	})
})
