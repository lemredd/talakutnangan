import ErrorBag from "$!/errors/error_bag"
import UserFactory from "~/factories/user"
import Factory from "~/factories/chat_message"
import MockRequester from "~/set-ups/mock_requester"
import ConsultationFactory from "~/factories/consultation"

import Controller from "./update(id).patch"

const BODY_VALIDATION_INDEX = 1

describe("Controller: PATCH /api/chat_message/:id", () => {
	const requester = new MockRequester()

	it("can accept valid info", async() => {
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const user = await new UserFactory().beReachableEmployee().insertOne()
		const consultation = await new ConsultationFactory().insertOne()
		const model = await new Factory()
		.user(() => Promise.resolve(user))
		.consultation(() => Promise.resolve(consultation))
		.insertOne()
		requester.customizeRequest({
			"body": {
				"data": {
					"attributes": {
						"data": model.data
					},
					"id": String(model.id),
					"type": "chat_message"
				}
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		requester.expectSuccess()
	})

	it("cannot accept invalid data", async() => {
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const user = await new UserFactory().beReachableEmployee().insertOne()
		const consultation = await new ConsultationFactory().insertOne()
		const model = await new Factory()
		.user(() => Promise.resolve(user))
		.consultation(() => Promise.resolve(consultation))
		.insertOne()
		requester.customizeRequest({
			"body": {
				"data": {
					"attributes": {
						"data": "not an object"
					},
					"id": String(model.id),
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
