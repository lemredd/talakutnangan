import ErrorBag from "$!/errors/error_bag"
import UserFactory from "~/factories/user"
import Factory from "~/factories/chat_message"
import MockRequester from "~/set-ups/mock_requester"
import ChatMessageActivityFactory from "~/factories/chat_message_activity"

import Controller from "./create.post"

const BODY_VALIDATION_INDEX = 0

describe("Controller: POST /api/chat_message", () => {
	const requester = new MockRequester()

	it("can accept valid info", async() => {
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const chatMessageActivity = await new ChatMessageActivityFactory().insertOne()
		const { user } = chatMessageActivity
		const model = await new Factory()
		.chatMessageActivity(() => Promise.resolve(chatMessageActivity))
		.makeOne()
		requester.customizeRequest({
			"body": {
				"data": {
					"attributes": {
						"data": model.data,
						"kind": model.kind
					},
					"relationships": {
						"chatMessageActivity": {
							"data": {
								"id": String(chatMessageActivity.id),
								"type": "chat_message_activity"
							}
						}
					},
					"type": "chat_message"
				}
			},
			"user": new UserFactory().serialize(user)
		})

		await requester.runMiddleware(bodyValidationFunction)

		const request = requester.expectSuccess()
		expect(request).toHaveProperty("body.data.attributes.data", model.data)
	})

	it("cannot accept invalid data", async() => {
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const otherUser = await new UserFactory().serializedOne(true)
		const chatMessageActivity = await new ChatMessageActivityFactory().insertOne()
		requester.customizeRequest({
			"body": {
				"data": {
					"attributes": {
						"data": "not an object",
						"kind": "123"
					},
					"relationships": {
						"chatMessageActivity": {
							"data": {
								"id": String(chatMessageActivity.id),
								"type": "chat_message_activity"
							}
						}
					},
					"type": "chat_message"
				}
			},
			"user": otherUser
		})

		await requester.runMiddleware(bodyValidationFunction)

		const body = requester.expectFailure(ErrorBag).toJSON()
		expect(body).toHaveLength(3)
		expect(body).toHaveProperty("0.source.pointer", "data.attributes.data")
		expect(body).toHaveProperty("1.source.pointer", "data.attributes.kind")
		expect(body).toHaveProperty(
			"2.source.pointer",
			"data.relationships.chatMessageActivity.data.id"
		)
	})
})
