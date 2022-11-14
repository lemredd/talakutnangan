import ErrorBag from "$!/errors/error_bag"
import PostFactory from "~/factories/post"
import MockRequester from "~/setups/mock_requester"
import Controller from "./update(id).patch"

const BODY_VALIDATION_INDEX = 1

describe("Controller: PATCH /api/post/:id", () => {
	const requester = new MockRequester()

	it("can accept valid info with new details", async() => {
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const post = await new PostFactory().insertOne()
		const newPost = await new PostFactory().makeOne()
		requester.customizeRequest({
			"body": {
				"data": {
					"attributes": {
						"content": newPost.content
					},
					"id": String(post.id),
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

	it("cannot accept with dangerous tags", async() => {
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const post = await new PostFactory().insertOne()
		const newPost = await new PostFactory()
		.content(() => "<script>Hello world</script>")
		.makeOne()
		requester.customizeRequest({
			"body": {
				"data": {
					"attributes": {
						"content": newPost.content
					},
					"id": String(post.id),
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
						"content": 0
					},
					"id": String(post.id),
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
