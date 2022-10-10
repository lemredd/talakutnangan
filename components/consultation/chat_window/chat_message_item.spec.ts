import { shallowMount } from "@vue/test-utils"
import type { TextMessage, StatusMessage } from "$/types/message"
import type { DeserializedUserDocument } from "$/types/documents/user"
import type { DeserializedChatMessageResource } from "$/types/documents/chat_message"

import Component from "./chat_message_item.vue"

describe("Component: consultation/chat_window/chat_message_item", () => {
	describe("Text message", () => {
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
					},
					"stubs": {
						"ProfilePicture": {
							"name": "ProfilePicture",
							"template": "<img/>"
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
			const messageItemContent = wrapper.find(".message-item-content")
			const messageItemProfilePicture = wrapper.find(".message-item .self")

			expect(messageItem.find(".self").exists()).toBeTruthy()
			expect(messageItemContent.html()).toContain(textValue)
			expect(messageItemProfilePicture.exists()).toBeTruthy()
			expect(messageItemProfilePicture.attributes("title")).toEqual(user.data.name)
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
					},
					"stubs": {
						"ProfilePicture": {
							"name": "ProfilePicture",
							"template": "<img/>"
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
			const messageItemContent = wrapper.find(".message-item-content")
			const messageItemProfilePicture = wrapper.find(".message-item .other")

			expect(messageItem.find(".other").exists()).toBeTruthy()
			expect(messageItemContent.html()).toContain(textValue)
			expect(messageItemProfilePicture.exists()).toBeTruthy()
			expect(messageItemProfilePicture.attributes("title")).toEqual(other.data.name)
		})
	})

	describe("Status message", () => {
		it("should show other's status message properly", () => {
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
			const textValue = "Hello foo!"
			const wrapper = shallowMount<any>(Component, {
				"global": {
					"provide": {
						"pageContext": {
							"pageProps": {
								"userProfile": user
							}
						}
					},
					"stubs": {
						"ProfilePicture": {
							"name": "ProfilePicture",
							"template": "<img/>"
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
						"kind": "status",
						"type": "chat_message",
						"updatedAt": CURRENT_TIME,
						"user": other
					} as DeserializedChatMessageResource<"user"> & StatusMessage<"deserialized">
				}
			})

			const messageItem = wrapper.find(".message-item")
			const messageItemContent = wrapper.find(".message-item-content")

			expect(messageItem.classes()).toContain("status-message")
			expect(messageItemContent.html()).toContain(textValue)
			expect(messageItemContent.html()).toContain(other.data.name)
		})
	})

	describe("File message", () => {
		it.only("can show file type message properly", () => {
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
			const value = JSON.stringify({
				"name": "Scan_20220112 (2).png",
				"subkind": "image"
			})
			const wrapper = shallowMount<any>(Component, {
				"global": {
					"provide": {
						"pageContext": {
							"pageProps": {
								"userProfile": user
							}
						}
					},
					"stubs": {
						"ProfilePicture": {
							"name": "ProfilePicture",
							"template": "<img/>"
						}
					}
				},
				"props": {
					"chatMessage": {
						"attachedChatFile": {
							"data": {
								"fileContents": "http://localhost:16000/api/attached_chat_file/1",
								"id": "1",
								"type": "attached_chat_file"
							}
						},
						"createdAt": CURRENT_TIME,
						"data": { value },
						"id": "0",
						"kind": "file",
						"type": "chat_message",
						"updatedAt": CURRENT_TIME,
						user
					}
				}
			})
			const fileMessageContent = wrapper.find(".file-message-content")
			// TODO(lead): display other elements for other file types
			const actualFile = fileMessageContent.find("img")
			expect(fileMessageContent.exists()).toBeTruthy()
			expect(actualFile.exists()).toBeTruthy()
			expect(actualFile.attributes("src")).toBeDefined()
		})
	})
})
