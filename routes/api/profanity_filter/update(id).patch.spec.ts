import ErrorBag from "$!/errors/error_bag"
import Factory from "~/factories/profanity_filter"
import MockRequester from "~/setups/mock_requester"

import Controller from "./update(id).patch"

const BODY_VALIDATION_INDEX = 1

describe("Controller: PATCH /api/profanity_filter/:id", () => {
	const requester = new MockRequester()

	it("can accept valid info", async() => {
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const profanityFilter = await new Factory().insertOne()
		const newProfanityFilter = await new Factory().makeOne()
		requester.customizeRequest({
			"body": {
				"data": {
					"attributes": {
						"word": String(newProfanityFilter.word)
					},
					"id": String(profanityFilter.id),
					"type": "profanity_filter"
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
		const profanityFilter = await new Factory().insertOne()
		requester.customizeRequest({
			"body": {
				"data": {
					"attributes": {
						"word": 1
					},
					"id": String(profanityFilter.id),
					"type": "profanity_filter"
				}
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		const body = requester.expectFailure(ErrorBag).toJSON()

		expect(body).toHaveLength(1)
		expect(body).toHaveProperty("0.source.pointer", "data.attributes.word")
	})
})
