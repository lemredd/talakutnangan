import { DeserializedChatMessageResource } from "$/types/documents/chat_message"
import {
	isMessageKindFile,
	isMessageKindStatus,
	isMessageKindText
} from "./chat_message_kinds"


describe("Helper: Chat message kinds", () => {
	it("can determine if message kind is file", () => {
		const CURRENT_TIME = new Date()
		const message = {
			"createdAt": CURRENT_TIME,
			"data": {
				"value": ""
			},
			"id": "0",
			"kind": "file",
			"type": "chat_message",
			"updatedAt": CURRENT_TIME,
			"user": {
				"data": {
					"deletedAt": null,
					"email": "",
					"emailVerifiedAt": null,
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
			}
		} as DeserializedChatMessageResource<"user">

		expect(isMessageKindFile(message)).toBeTruthy()
	})

	it("can determine if message kind is status", () => {
		const CURRENT_TIME = new Date()
		const message = {
			"createdAt": CURRENT_TIME,
			"data": {
				"value": ""
			},
			"id": "0",
			"kind": "status",
			"type": "chat_message",
			"updatedAt": CURRENT_TIME,
			"user": {
				"data": {
					"deletedAt": null,
					"email": "",
					"emailVerifiedAt": null,
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
			}
		} as DeserializedChatMessageResource<"user">

		expect(isMessageKindStatus(message)).toBeTruthy()
	})

	it("can determine if message kind is text", () => {
		const CURRENT_TIME = new Date()
		const message = {
			"createdAt": CURRENT_TIME,
			"data": {
				"value": ""
			},
			"id": "0",
			"kind": "text",
			"type": "chat_message",
			"updatedAt": CURRENT_TIME,
			"user": {
				"data": {
					"deletedAt": null,
					"email": "",
					"emailVerifiedAt": null,
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
			}
		} as DeserializedChatMessageResource<"user">

		expect(isMessageKindText(message)).toBeTruthy()
	})
})
