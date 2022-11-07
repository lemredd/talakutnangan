import ErrorBag from "$!/errors/error_bag"
import CommentFactory from "~/factories/comment"
import MockRequester from "~/setups/mock_requester"
import Controller from "./update(id).patch"

const BODY_VALIDATION_INDEX = 1

describe("Controller: POST /api/comment/:id", () => {
	const requester = new MockRequester()

	it("can accept valid info with new details", async() => {
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const comment = await new CommentFactory().insertOne()
		const newComment = await new CommentFactory().makeOne()
		requester.customizeRequest({
			"body": {
				"data": {
					"attributes": {
						"approvedAt": newComment.approvedAt,
						"content": newComment.content
					},
					"id": String(comment.id),
					"type": "comment"
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
		const comment = await new CommentFactory().insertOne()
		requester.customizeRequest({
			"body": {
				"data": {
					"attributes": {
						"approvedAt": 1,
						"content": 1
					},
					"id": String(comment.id),
					"type": "comment"
				}
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		const body = requester.expectFailure(ErrorBag).toJSON()

		expect(body).toHaveLength(2)
		expect(body).toHaveProperty("0.source.pointer", "data.attributes.approvedAt")
		expect(body).toHaveProperty("1.source.pointer", "data.attributes.content")
	})
})
