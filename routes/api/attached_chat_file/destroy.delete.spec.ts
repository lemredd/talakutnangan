import ErrorBag from "$!/errors/error_bag"
import UserFactory from "~/factories/user"
import MockRequester from "~/setups/mock_requester"
import Factory from "~/factories/attached_chat_file"
import ChatMessageFactory from "~/factories/chat_message"
import ChatMessageActivityFactory from "~/factories/chat_message_activity"

import Controller from "./destroy.delete"

const BODY_VALIDATION_INDEX = 0

describe("Controller: DELETE /api/attached_chat_file", () => {
	const requester = new MockRequester()

	it("can accept valid info", async() => {
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const userFactory = new UserFactory()
		const user = await userFactory.insertOne()
		const chatMessageActivity = await new ChatMessageActivityFactory()
		.user(() => Promise.resolve(user))
		.insertOne()
		const chatMessage = await new ChatMessageFactory()
		.chatMessageActivity(() => Promise.resolve(chatMessageActivity))
		.insertOne()
		const model = await new Factory().chatMessage(() => Promise.resolve(chatMessage)).insertOne()
		requester.customizeRequest({
			"body": {
				"data": [
					{
						"id": String(model.id),
						"type": "attached_chat_file"
					}
				]
			},
			"user": userFactory.serialize(user)
		})

		await requester.runMiddleware(bodyValidationFunction)

		requester.expectSuccess()
	})

	it("cannot accept absent resources", async() => {
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const userFactory = new UserFactory()
		const user = await userFactory.insertOne()
		const chatMessageActivity = await new ChatMessageActivityFactory()
		.user(() => Promise.resolve(user))
		.insertOne()
		const chatMessage = await new ChatMessageFactory()
		.chatMessageActivity(() => Promise.resolve(chatMessageActivity))
		.insertOne()
		const model = await new Factory().chatMessage(() => Promise.resolve(chatMessage)).insertOne()
		await model.destroy({ "force": true })
		requester.customizeRequest({
			"body": {
				"data": [
					{
						"id": String(model.id),
						"type": "attached_chat_file"
					}
				]
			},
			"user": userFactory.serialize(user)
		})

		await requester.runMiddleware(bodyValidationFunction)

		const body = requester.expectFailure(ErrorBag).toJSON()
		expect(body).toHaveLength(1)
		expect(body).toHaveProperty("0.source.pointer", "data.0.id")
	})
})
