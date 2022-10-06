import ErrorBag from "$!/errors/error_bag"
import PostFactory from "~/factories/post"
import MockRequester from "~/setups/mock_requester"

import Controller from "./create.post"

const BODY_VALIDATION_INDEX = 0

describe("Controller: POST /api/post", () => {
	const requester = new MockRequester()

	it("can accept valid info", async() => {
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const post = await new PostFactory().makeOne()
		requester.customizeRequest({
			"body": {
				"data": {
					"attributes": {
						"attachedRoleID": post.attachedRoleID,
						"content": post.content
					},
					"relationships": {
						"poster": {
							"data": {
								"id": String(post.poster?.id),
								"type": "user"
							}
						},
						"posterRole": {
							"data": {
								"id": String(post.posterRole?.id),
								"type": "role"
							}
						}
					},
					"type": "post"
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
		const post = await new PostFactory().insertOne()
		requester.customizeRequest({
			"body": {
				"data": {
					"attributes": {
						"attachedRoleID": "not a role",
						"content": 1
					},
					"relationships": {
						"poster": {
							"data": {
								"id": String(post.poster?.id),
								"type": "user"
							}
						},
						"posterRole": {
							"data": {
								"id": String(post.posterRole?.id),
								"type": "role"
							}
						}
					},
					"type": "post"
				}
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		const body = requester.expectFailure(ErrorBag).toJSON()
		expect(body).toHaveLength(1)
		expect(body).toHaveProperty("0.source.pointer", "data.attributes.content")
	})
})
