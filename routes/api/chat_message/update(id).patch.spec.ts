import ErrorBag from "$!/errors/error_bag"
import UserFactory from "~/factories/user"
import Factory from "~/factories/chat_message"
import MockRequester from "~/setups/mock_requester"
import AuthorizationError from "$!/errors/authorization"
import ChatMessageActivityFactory from "~/factories/chat_message_activity"

import Controller from "./update(id).patch"

const BODY_VALIDATION_INDEX = 1

describe("Controller: PATCH /api/chat_message/:id", () => {
	const requester = new MockRequester()

	it("can accept valid info", async() => {
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const chatMessageActivity = await new ChatMessageActivityFactory().insertOne()
		const { user } = chatMessageActivity
		const model = await new Factory().chatMessageActivity(
			() => Promise.resolve(chatMessageActivity)
		).insertOne()
		const newModel = await new Factory().makeOne()
		requester.customizeRequest({
			"body": {
				"data": {
					"attributes": {
						"data": newModel.data,
						"kind": newModel.kind
					},
					"id": String(model.id),
					"type": "chat_message"
				}
			},
			"user": new UserFactory().serialize(user)
		})

		await requester.runMiddleware(bodyValidationFunction)

		requester.expectSuccess()
	})

	it("can accept owned info", async() => {
		const controller = new Controller()
		const { policy } = controller
		const policyFunction = policy.intermediate.bind(policy)
		const chatMessageActivity = await new ChatMessageActivityFactory()
		.user(() => new UserFactory().beReachableEmployee().insertOne())
		.insertOne()
		const { user } = chatMessageActivity
		const model = await new Factory().chatMessageActivity(
			() => Promise.resolve(chatMessageActivity)
		).insertOne()
		requester.customizeRequest({
			"isAuthenticated": jest.fn().mockReturnValue(true),
			"params": {
				"id": String(model.id)
			},
			"user": {
				...new UserFactory().serialize(user),
				"meta": {
					"hasDefaultPassword": false
				}
			}
		})

		await requester.runMiddleware(policyFunction)

		requester.expectSuccess()
	})

	it("cannot accept unowned info", async() => {
		const controller = new Controller()
		const { policy } = controller
		const policyFunction = policy.intermediate.bind(policy)
		const otherUser = await new UserFactory().beReachableEmployee().serializedOne(true)
		const chatMessageActivity = await new ChatMessageActivityFactory()
		.user(() => new UserFactory().beReachableEmployee().insertOne())
		.insertOne()
		const model = await new Factory().chatMessageActivity(
			() => Promise.resolve(chatMessageActivity)
		).insertOne()
		requester.customizeRequest({
			"isAuthenticated": jest.fn().mockReturnValue(true),
			"params": {
				"id": String(model.id)
			},
			"user": {
				...otherUser,
				"meta": {
					"hasDefaultPassword": false
				}
			}
		})

		await requester.runMiddleware(policyFunction)

		requester.expectFailure(AuthorizationError)
	})

	it("cannot accept invalid data", async() => {
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const otherUser = await new UserFactory().serializedOne(true)
		const model = await new Factory().insertOne()
		const newModel = await new Factory().makeOne()
		requester.customizeRequest({
			"body": {
				"data": {
					"attributes": {
						"data": "not an object",
						"kind": newModel.kind
					},
					"id": String(model.id),
					"type": "chat_message"
				}
			},
			"user": otherUser
		})

		await requester.runMiddleware(bodyValidationFunction)

		const body = requester.expectFailure(ErrorBag).toJSON()
		expect(body).toHaveLength(1)
		expect(body).toHaveProperty("0.source.pointer", "data.attributes.data")
	})
})
