import flushPromises from "flush-promises"
import { shallowMount } from "@vue/test-utils"

import { COMMENT_LINK } from "$/constants/template_links"

import RequestEnvironment from "$/singletons/request_environment"

import Component from "./create_field.vue"

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
			"data": {
				"attributes": { content },
				...commentIdentifier
			}
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

		const field = wrapper.findComponent({ "name": "Field" })
		await field.setValue(content)
		await field.vm.$emit("submitComment")
		await flushPromises()

		const castFetch = fetch as jest.Mock<any, any>
		const [ [ firstRequest ] ] = castFetch.mock.calls
		expect(firstRequest).toHaveProperty("method", "POST")
		expect(firstRequest).toHaveProperty("url", COMMENT_LINK.unbound)
		const firstRequestBody = await firstRequest.json()
		expect(firstRequestBody).toHaveProperty("data.type", "comment")
		expect(firstRequestBody).toHaveProperty("data.attributes.content", content)
		expect(firstRequestBody).not.toHaveProperty("data.relationships.parentComment")
		expect(firstRequestBody).toHaveProperty("data.relationships.user.data.id", userID)
		expect(firstRequestBody).toHaveProperty("data.relationships.post.data.id", postID)

		const updates = wrapper.emitted("createComment")
		expect(updates).toHaveLength(1)
		expect(updates).toHaveProperty("0.0.type", "comment")
		expect(updates).toHaveProperty("0.0.content", content)
		expect(updates).toHaveProperty("0.0.id", commentIdentifier.id)
		expect(updates).toHaveProperty("0.0.user", userProfile)
		// eslint-disable-next-line no-undefined
		expect(updates).toHaveProperty("0.0.parentComment", undefined)
		expect(updates).toHaveProperty("0.0.post.data", post)
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
			"data": {
				"attributes": { content },
				...commentIdentifier
			}
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

		const field = wrapper.findComponent({ "name": "Field" })
		await field.setValue(content)
		await field.vm.$emit("submitComment")
		await flushPromises()

		const castFetch = fetch as jest.Mock<any, any>
		const [ [ firstRequest ] ] = castFetch.mock.calls
		expect(firstRequest).toHaveProperty("method", "POST")
		expect(firstRequest).toHaveProperty("url", COMMENT_LINK.unbound)
		const firstRequestBody = await firstRequest.json()
		expect(firstRequestBody).toHaveProperty("data.type", "comment")
		expect(firstRequestBody).toHaveProperty("data.attributes.content", content)
		expect(firstRequestBody).toHaveProperty("data.relationships.user.data.id", userID)
		expect(firstRequestBody).toHaveProperty("data.relationships.post.data.id", postID)
		expect(firstRequestBody).toHaveProperty(
			"data.relationships.parentComment.data.id",
			parentCommentID
		)

		const updates = wrapper.emitted("createComment")
		expect(updates).toHaveLength(1)
		expect(updates).toHaveProperty("0.0.type", "comment")
		expect(updates).toHaveProperty("0.0.content", content)
		expect(updates).toHaveProperty("0.0.id", commentIdentifier.id)
		expect(updates).toHaveProperty("0.0.user", userProfile)
		expect(updates).toHaveProperty("0.0.parentComment.data", parentComment)
		expect(updates).toHaveProperty("0.0.post.data", post)
	})
})
