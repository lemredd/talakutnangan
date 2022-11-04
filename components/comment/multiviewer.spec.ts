import { shallowMount, flushPromises } from "@vue/test-utils"

import type { DeserializedCommentListDocument } from "$/types/documents/comment"

import { JSON_API_MEDIA_TYPE } from "$/types/server"
import { DEBOUNCED_WAIT_DURATION } from "$@/constants/time"
import { COUNT_COMMENT_VOTES } from "$/constants/template_links"

import specializePath from "$/helpers/specialize_path"
import stringifyQuery from "$@/fetchers/stringify_query"
import RequestEnvironment from "$/singletons/request_environment"

import { comment as permissionGroup } from "$/permissions/permission_list"
import {
	UPDATE_PERSONAL_COMMENT_ON_OWN_DEPARTMENT
} from "$/permissions/comment_combinations"

import Component from "./multiviewer.vue"

describe("Component: comment/multiviewer", () => {
	it("should load properly", async() => {
		jest.useFakeTimers()
		const userID = "1"
		const commentID = "2"
		const modelValue = {
			"data": [
				{
					"content": "Hello world!",
					"deletedAt": null,
					"id": commentID,
					"type": "comment",
					"user": {
						"data": {
							"id": userID,
							"type": "user"
						}
					}
				}
			],
			"meta": {
				"count": 1
			}
		} as DeserializedCommentListDocument<"user">
		fetchMock.mockResponseOnce(JSON.stringify({
			"data": [
				{
					"id": commentID,
					"meta": {},
					"type": "comment_vote"
				}
			]
		}), { "status": RequestEnvironment.status.OK })

		const wrapper = shallowMount(Component, {
			"global": {
				"provide": {
					"pageContext": {
						"pageProps": {
							"userProfile": {
								"data": {
									"id": userID,
									"roles": {
										"data": [
											{
												"id": "1",
												"postFlags": permissionGroup.generateMask(
													...UPDATE_PERSONAL_COMMENT_ON_OWN_DEPARTMENT
												)
											}
										]
									},
									"type": "user"
								}
							}
						}
					}
				},
				"stubs": {
					"Dropdown": false
				}
			},
			"props": {
				"isPostOwned": false,
				modelValue,
				"post": {
					"id": "1"
				}
			}
		})

		jest.advanceTimersByTime(DEBOUNCED_WAIT_DURATION)
		await flushPromises()

		const castFetch = fetch as jest.Mock<any, any>
		expect(castFetch).toHaveBeenCalledTimes(1)
		const [ [ request ] ] = castFetch.mock.calls
		expect(request).toHaveProperty("method", "GET")
		expect(request).toHaveProperty("url", specializePath(COUNT_COMMENT_VOTES, {
			"query": stringifyQuery({
				"filter": {
					"IDs": [ commentID ]
				}
			})
		}))
		expect(request.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
		expect(request.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)
	})
})
