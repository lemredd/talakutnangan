import ErrorBag from "$!/errors/error_bag"
import CommentFactory from "~/factories/comment"
import MockRequester from "~/setups/mock_requester"

import Controller from "./create.post"

const BODY_VALIDATION_INDEX = 0

describe("Controller: POST /api/comment", () => {
	const requester = new MockRequester()

	it("can accept valid info", async() => {
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const comment = await new CommentFactory().makeOne()
		requester.customizeRequest({
			"body": {
				"data": {
					"attributes": {
						"approvedAt": comment.approvedAt,
						"content": comment.content
					},
					"relationships": {
						"post": {
							"data": {
								"id": String(comment.postID),
								"type": "post"
							}
						},
						"user": {
							"data": {
								"id": String(comment.userID),
								"type": "user"
							}
						}
					},
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
		requester.customizeRequest({
			"body": {
				"data": {
					"attributes": {
						"approvedAt": 1,
						"content": 1
					},
					"relationships": {
						"post": {
							"data": {
								"id": 1,
								"type": "post"
							}
						},
						"user": {
							"data": {
								"id": 1,
								"type": "user"
							}
						}
					},
					"type": "comment"
				}
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		const body = requester.expectFailure(ErrorBag).toJSON()

		expect(body).toHaveLength(4)
		expect(body).toHaveProperty("0.source.pointer", "data.attributes.approvedAt")
		expect(body).toHaveProperty("1.source.pointer", "data.attributes.content")
		expect(body).toHaveProperty("2.source.pointer", "data.relationships.post.data.id")
		expect(body).toHaveProperty("3.source.pointer", "data.relationships.user.data.id")
	})
})
