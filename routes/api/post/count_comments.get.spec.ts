import ErrorBag from "$!/errors/error_bag"
import PostFactory from "~/factories/post"
import MockRequester from "~/setups/mock_requester"

import Controller from "./count_comments.get"

const BODY_VALIDATION_INDEX = 0

describe("Controller: GET /api/post/count_comments", () => {
	const requester = new MockRequester()

	it("can accept valid info", async() => {
		const posts = await new PostFactory().insertMany(2)
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		requester.customizeRequest({
			"query": {
				"filter": {
					"IDs": posts.map(post => post.id).join(",")
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
