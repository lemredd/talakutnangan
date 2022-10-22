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
		const userProfile = {
			"data": {
				"id": userID,
				"type": "user"
			}
		}
		const post = {
			"id": postID,
			"type": "post"
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
							userProfile
						}
					}
				}
			},
			"props": {
				post
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

		const updates = wrapper.emitted("createComment")
		expect(updates).toHaveLength(1)
		expect(updates).toHaveProperty("data.type", "comment")
		expect(updates).toHaveProperty("data.content", content)
		expect(updates).toHaveProperty("data.id", commentIdentifier.id)
		expect(updates).toHaveProperty("data.user", userProfile)
		expect(updates).not.toHaveProperty("data.parentComment")
		expect(updates).toHaveProperty("data.post", post)
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
		const userProfile = {
			"data": {
				"id": userID,
				"type": "user"
			}
		}
		const parentComment = {
			"id": parentCommentID,
			"type": "comment"
		}
		const post = {
			"id": postID,
			"type": "post"
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
							userProfile
						}
					}
				}
			},
			"props": {
				parentComment,
				post
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

		const updates = wrapper.emitted("createComment")
		expect(updates).toHaveLength(1)
		expect(updates).toHaveProperty("data.type", "comment")
		expect(updates).toHaveProperty("data.content", content)
		expect(updates).toHaveProperty("data.id", commentIdentifier.id)
		expect(updates).toHaveProperty("data.user", userProfile)
		expect(updates).toHaveProperty("data.parentComment", parentComment)
		expect(updates).toHaveProperty("data.post", post)
	})
})
