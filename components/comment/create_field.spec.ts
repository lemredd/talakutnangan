import flushPromises from "flush-promises"
import { shallowMount } from "@vue/test-utils"

import { COMMENT_LINK } from "$/constants/template_links"

import RequestEnvironment from "$/singletons/request_environment"

import Component from "./create_comment_field.vue"

describe("Component: comment/create_field", () => {
	it("may submit independently", async() => {
		const postID = "1"
		const userID = "2"
		const content = "Hello world"
		const commentIdentifier = {
			"id": "1",
			"type": "comment"
		}
		const comment = {
			"data": { content },
			...commentIdentifier
		}
		fetchMock.mockResponseOnce(
			JSON.stringify(comment),
			{ "status": RequestEnvironment.status.OK }
		)
		const wrapper = shallowMount<any>(Component, {
			"global": {
				"provide": {
					"pageContext": {
						"pageProps": {
							"userProfile": {
								"data": {
									"id": userID,
									"type": "user"
								}
							}
						}
					}
				}
			},
			"props": {
				"post": {
					"id": postID,
					"type": "post"
				}
			}
		})

		const field = wrapper.findComponent({ "name": "TextualField" })
		await field.setValue(content)
		await field.trigger("keyup.enter")
		await flushPromises()

		const castFetch = fetch as jest.Mock<any, any>
		const [ [ firstRequest ] ] = castFetch.mock.calls
		expect(firstRequest).toHaveProperty("method", "POST")
		expect(firstRequest).toHaveProperty("url", COMMENT_LINK.unbound)
		const firstRequestBody = await firstRequest.json()
		expect(firstRequestBody).toHaveProperty("data.type", "comment")
		expect(firstRequestBody).toHaveProperty("data.attributes", { content })
		expect(firstRequestBody).not.toHaveProperty("data.relationships.parentComment")
		expect(firstRequestBody).toHaveProperty("data.relationships.user.data.id", userID)
		expect(firstRequestBody).toHaveProperty("data.relationships.post.data.id", postID)
	})

	it("may submit dependently", async() => {
		const postID = "1"
		const userID = "2"
		const parentCommentID = "3"
		const content = "Hello world"
		const commentIdentifier = {
			"id": "1",
			"type": "comment"
		}
		const comment = {
			"data": { content },
			...commentIdentifier
		}
		fetchMock.mockResponseOnce(
			JSON.stringify(comment),
			{ "status": RequestEnvironment.status.OK }
		)
		const wrapper = shallowMount<any>(Component, {
			"global": {
				"provide": {
					"pageContext": {
						"pageProps": {
							"userProfile": {
								"data": {
									"id": userID,
									"type": "user"
								}
							}
						}
					}
				}
			},
			"props": {
				"parentComment": {
					"id": parentCommentID,
					"type": "comment"
				},
				"post": {
					"id": postID,
					"type": "post"
				}
			}
		})

		const field = wrapper.findComponent({ "name": "TextualField" })
		await field.setValue(content)
		await field.trigger("keyup.enter")
		await flushPromises()

		const castFetch = fetch as jest.Mock<any, any>
		const [ [ firstRequest ] ] = castFetch.mock.calls
		expect(firstRequest).toHaveProperty("method", "POST")
		expect(firstRequest).toHaveProperty("url", COMMENT_LINK.unbound)
		const firstRequestBody = await firstRequest.json()
		expect(firstRequestBody).toHaveProperty("data.type", "comment")
		expect(firstRequestBody).toHaveProperty("data.attributes", { content })
		expect(firstRequestBody).toHaveProperty("data.relationships.user.data.id", userID)
		expect(firstRequestBody).toHaveProperty("data.relationships.post.data.id", postID)
		expect(firstRequestBody).toHaveProperty(
			"data.relationships.parentComment.data.id",
			parentCommentID
		)
	})
})
