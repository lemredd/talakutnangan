import ErrorBag from "$!/errors/error_bag"
import CommentFactory from "~/factories/comment"
import MockRequester from "~/setups/mock_requester"

import Controller from "./count_vote"

const BODY_VALIDATION_INDEX = 0

describe("Controller: GET /api/comment/count_votes", () => {
	const requester = new MockRequester()

	it("can accept valid info", async() => {
		const comment = await new CommentFactory().insertOne()
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		requester.customizeRequest({
			"query": {
				"filter": {
					"IDs": String(comment.id)
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
