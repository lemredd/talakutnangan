import ErrorBag from "$!/errors/error_bag"
import UserFactory from "~/factories/user"
import MockRequester from "~/set-ups/mock_requester"
import ChatMessageFactory from "~/factories/chat_message"
import ConsultationFactory from "~/factories/consultation"
import Controller from "./create.post"

const BODY_VALIDATION_INDEX = 0

describe("Controller: POST /api/chat_message", () => {
	const requester = new MockRequester()

	it("can accept valid info", async() => {
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const user = await new UserFactory().beReachableEmployee().insertOne()
		const consultation = await new ConsultationFactory().insertOne()
		const chatMessage = await new ChatMessageFactory()
		.user(() => Promise.resolve(user))
		.consultation(() => Promise.resolve(consultation))
		.makeOne()
		requester.customizeRequest({
			"body": {
				"data": {
					"attributes": {
						"data": chatMessage.data
					},
					"relationships": {
						"consultation": {
							"data": {
								"id": String(consultation.id),
								"type": "consultation"
							}
						},
						"user": {
							"data": {
								"id": String(user.id),
								"type": "user"
							}
						}
					},
					"type": "chat_message"
				}
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		requester.expectSuccess()
	})

	it("cannot accept invalid name", async() => {
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const user = await new UserFactory().beReachableEmployee().insertOne()
		const consultation = await new ConsultationFactory().insertOne()
		requester.customizeRequest({
			"body": {
				"data": {
					"attributes": {
						"data": "not an object"
					},
					"relationships": {
						"consultation": {
							"data": {
								"id": String(consultation.id),
								"type": "consultation"
							}
						},
						"user": {
							"data": {
								"id": String(user.id),
								"type": "user"
							}
						}
					},
					"type": "chat_message"
				}
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		const body = requester.expectFailure(ErrorBag).toJSON()
		expect(body).toHaveLength(1)
		expect(body).toHaveProperty("0.source.pointer", "data.attributes.data")
	})
})
