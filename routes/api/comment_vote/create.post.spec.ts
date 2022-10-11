import ErrorBag from "$!/errors/error_bag"
import CommentVoteFactory from "~/factories/comment_vote"
import MockRequester from "~/setups/mock_requester"

import Controller from "./create.post"

const BODY_VALIDATION_INDEX = 0

describe("Controller: POST /api/comment_vote", () => {
	const requester = new MockRequester()

	it("can accept valid info", async() => {
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const commentVote = await new CommentVoteFactory().makeOne()
		requester.customizeRequest({
			"body": {
				"data": {
					"attributes": {
						"kind": commentVote.kind
					},
					"relationships": {
						"comment": {
							"data": {
								"id": String(commentVote.commentID),
								"type": "post"
							}
						},
						"user": {
							"data": {
								"id": String(commentVote.userID),
								"type": "user"
							}
						}
					},
					"type": "comment_vote"
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
						"kind": 1
					},
					"relationships": {
						"comment": {
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
					"type": "comment_vote"
				}
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		const body = requester.expectFailure(ErrorBag).toJSON()

		expect(body).toHaveLength(3)
		expect(body).toHaveProperty("0.source.pointer", "data.attributes.kind")
		expect(body).toHaveProperty("1.source.pointer", "data.relationships.comment.data.id")
		expect(body).toHaveProperty("2.source.pointer", "data.relationships.user.data.id")
	})
})
