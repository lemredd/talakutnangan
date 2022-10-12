import ErrorBag from "$!/errors/error_bag"
import CommentVoteFactory from "~/factories/comment_vote"
import MockRequester from "~/setups/mock_requester"

import Controller from "./update(id).patch"

const BODY_VALIDATION_INDEX = 1

describe("Controller: POST /api/comment_vote/:id", () => {
	const requester = new MockRequester()

	it("can accept valid info", async() => {
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const commentVote = await new CommentVoteFactory().insertOne()
		const newCommentVote = await new CommentVoteFactory().makeOne()
		requester.customizeRequest({
			"body": {
				"data": {
					"attributes": {
						"kind": newCommentVote.kind
					},
					"relationships": {
						"comment": {
							"data": {
								"id": String(newCommentVote.commentID),
								"type": "comment"
							}
						},
						"user": {
							"data": {
								"id": String(newCommentVote.userID),
								"type": "user"
							}
						}
					},
					"id": String(commentVote.id),
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
		const commentVote = await new CommentVoteFactory().insertOne()
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
								"type": "comment"
							}
						},
						"user": {
							"data": {
								"id": 1,
								"type": "user"
							}
						}
					},
					"id": String(commentVote.id),
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
