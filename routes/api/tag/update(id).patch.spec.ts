import ErrorBag from "$!/errors/error_bag"
import Factory from "~/factories/tag"
import MockRequester from "~/setups/mock_requester"

import Controller from "./update(id).patch"

const BODY_VALIDATION_INDEX = 1

describe("Controller: POST /api/tag/:id", () => {
	const requester = new MockRequester()

	it("can accept valid info", async() => {
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const tag = await new Factory().insertOne()
		const newTag = await new Factory().makeOne()
		requester.customizeRequest({
			"body": {
				"data": {
					"attributes": {
						"name": String(newTag.name)
					},
					"id": String(tag.id),
					"type": "tag"
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
		const tag = await new Factory().insertOne()
		requester.customizeRequest({
			"body": {
				"data": {
					"attributes": {
						"name": 1
					},
					"id": String(tag.id),
					"type": "tag"
				}
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		const body = requester.expectFailure(ErrorBag).toJSON()

		expect(body).toHaveLength(1)
		expect(body).toHaveProperty("0.source.pointer", "data.attributes.name")
	})
})
