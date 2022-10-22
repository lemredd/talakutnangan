/* eslint-disable max-lines */
import { shallowMount } from "@vue/test-utils"

import type { TextMessage, StatusMessage } from "$/types/message"
import type { DeserializedUserDocument } from "$/types/documents/user"
import type { DeserializedChatMessageResource } from "$/types/documents/chat_message"

import Component from "./chat_message_item.vue"
import { CHAT_MESSAGE_ACTIVITIES_IN_CONSULTATION } from "$@/constants/provided_keys"
import { DeserializedChatMessageActivityResource } from "$/types/documents/chat_message_activity"

describe("Component: consultation/chat_window/chat_message_item", () => {
	describe("text message", () => {
		const chatMessageActivities = {
			"data": {}
		}

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
						[CHAT_MESSAGE_ACTIVITIES_IN_CONSULTATION]: chatMessageActivities,
						"pageContext": {
							"pageProps": {
								chatMessageActivities,
								"userProfile": user
							}
						},
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
			expect(messageItemContent.text()).toContain(textValue)
			expect(messageItemProfilePicture.exists()).toBeTruthy()
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
						[CHAT_MESSAGE_ACTIVITIES_IN_CONSULTATION]: chatMessageActivities,
						"pageContext": {
							"pageProps": {
								chatMessageActivities,
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

	describe("status message", () => {
		const chatMessageActivities = {
			"data": []
		}

		it("should show own status message properly", () => {
			const CURRENT_TIME = new Date()
			const user = {
				"data": {
					"email": "",
					"id": "1",
					"kind": "reachable_employee",
					"name": "self",
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
			const textValue = "Hello foo!"
			const wrapper = shallowMount<any>(Component, {
				"global": {
					"provide": {
						[CHAT_MESSAGE_ACTIVITIES_IN_CONSULTATION]: chatMessageActivities,
						"pageContext": {
							"pageProps": {
								chatMessageActivities,
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
						user
					} as DeserializedChatMessageResource<"user"> & StatusMessage<"deserialized">
				}
			})

			const messageItem = wrapper.find(".message-item")
			const messageItemContent = wrapper.find(".message-item-content")

			expect(messageItem.classes()).toContain("status-message")
			expect(messageItemContent.html()).toContain(textValue)
			expect(messageItemContent.html()).toContain(user.data.name)
		})

		it("should show other's status message properly", () => {
			const CURRENT_TIME = new Date()
			const user = {
				"data": {
					"email": "",
					"id": "1",
					"kind": "reachable_employee",
					"name": "self",
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
					"name": "Other user",
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
						[CHAT_MESSAGE_ACTIVITIES_IN_CONSULTATION]: chatMessageActivities,
						"pageContext": {
							"pageProps": {
								chatMessageActivities,
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

	describe("file message", () => {
		const chatMessageActivities = {
			"data": []
		}

		it("can show image type message properly", () => {
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
			const value = {
				"name": "Scan_20220112 (2).png",
				"subkind": "image"
			}
			const wrapper = shallowMount<any>(Component, {
				"global": {
					"provide": {
						[CHAT_MESSAGE_ACTIVITIES_IN_CONSULTATION]: chatMessageActivities,
						"pageContext": {
							"pageProps": {
								chatMessageActivities,
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
						"data": value,
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

		it("can show file type message properly", () => {
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
			const value = {
				"name": "file.txt",
				"subkind": "file"
			}
			const wrapper = shallowMount<any>(Component, {
				"global": {
					"provide": {
						[CHAT_MESSAGE_ACTIVITIES_IN_CONSULTATION]: chatMessageActivities,
						"pageContext": {
							"pageProps": {
								chatMessageActivities,
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
						"data": value,
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
			const actualFile = fileMessageContent.find(".file-link")
			expect(fileMessageContent.exists()).toBeTruthy()
			expect(actualFile.exists()).toBeTruthy()
			expect(actualFile.attributes("href")).toBeDefined()
		})
	})

	describe("seen users", () => {
		it("can identify which users have seen latest message", () => {
			const CURRENT_TIME = new Date("2022-10-4 10:00:00")
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
			const data = {
				"value": "hello world"
			}
			const chatMessageActivities = [
				{
					"id": 0,
					"receivedMessageAt": new Date("2022-10-4 10:00:01"),
					"seenMessageAt": new Date("2022-10-4 10:01:03"),
					"type": "chat_message_activity",
					user
				} as unknown as DeserializedChatMessageActivityResource
			]
			const wrapper = shallowMount<any>(Component, {
				"global": {
					"provide": {
						[CHAT_MESSAGE_ACTIVITIES_IN_CONSULTATION]: chatMessageActivities,
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
						data,
						"id": "0",
						"kind": "text",
						"type": "chat_message",
						"updatedAt": CURRENT_TIME,
						user
					}
				}
			})
			const seenList = wrapper.find(".seen-list")
			const seenUser = seenList.find("img")

			expect(seenUser.exists()).toBeTruthy()
		})
	})
})
