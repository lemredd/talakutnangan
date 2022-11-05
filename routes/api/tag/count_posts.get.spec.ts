import ErrorBag from "$!/errors/error_bag"
import Factory from "~/factories/tag"
import MockRequester from "~/setups/mock_requester"

import Controller from "./count_posts.get"

const BODY_VALIDATION_INDEX = 0

describe("Controller: GET /api/tag/count_posts.get", () => {
	const requester = new MockRequester()

	it("can accept valid info", async() => {
		const tag = await new Factory().insertOne()
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		requester.customizeRequest({
			"query": {
				"filter": {
					"IDs": `${tag.id}`
				}
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		requester.expectSuccess()
	})

	it("cannot accept invalid info", async() => {
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		requester.customizeRequest({
			"query": {
				"filter": {
					"IDs": "1"
				}
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		const body = requester.expectFailure(ErrorBag).toJSON()
		expect(body).toHaveLength(1)
		expect(body).toHaveProperty("0.source.parameter", "filter.IDs.0")
	})
})
