/* eslint-disable max-lines */
import { shallowMount, flushPromises } from "@vue/test-utils"

import type { DeserializedCommentListDocument } from "$/types/documents/comment"

import { JSON_API_MEDIA_TYPE } from "$/types/server"
import { DEFAULT_LIST_LIMIT } from "$/constants/numerical"
import { DEBOUNCED_WAIT_DURATION } from "$@/constants/time"
import { COMMENT_LINK, COUNT_COMMENT_VOTES } from "$/constants/template_links"

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
					"type": "comment"
				}
			]
		}), { "status": RequestEnvironment.status.OK })

		const unusedWrapper = shallowMount<any>(Component, {
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
					"Suspensible": false
				}
			},
			"props": {
				"isPostOwned": false,
				"mayViewArchivedOrRestore": false,
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

	it("should load archived comments", async() => {
		jest.useFakeTimers()
		const userID = "1"
		const commentID = "2"
		const postID = "3"
		const archivedCommentID = "4"
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
					"type": "comment"
				}
			]
		}), { "status": RequestEnvironment.status.OK })
		fetchMock.mockResponseOnce(JSON.stringify({
			"data": [
				{
					"id": archivedCommentID,
					"type": "comment"
				}
			],
			"meta": {
				"count": 1
			}
		}), { "status": RequestEnvironment.status.OK })
		fetchMock.mockResponseOnce(JSON.stringify({
			"data": [
				{
					"id": archivedCommentID,
					"meta": {},
					"type": "comment"
				}
			]
		}), { "status": RequestEnvironment.status.OK })

		const wrapper = shallowMount<any>(Component, {
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
					"Suspensible": false
				}
			},
			"props": {
				"isPostOwned": true,
				"mayViewArchivedOrRestore": true,
				modelValue,
				"post": {
					"id": postID
				}
			}
		})

		jest.advanceTimersByTime(DEBOUNCED_WAIT_DURATION)
		await flushPromises()
		const selectableExistence = wrapper.findComponent({ "name": "SelectableExistenceFilter" })
		await selectableExistence.vm.$emit("update:modelValue", "archived")
		await wrapper.setProps({
			"modelValue": {
				"data": [],
				"meta": {
					"count": 0
				}
			}
		})
		await wrapper.setProps({
			"modelValue": {
				"data": [
					{
						"id": archivedCommentID
					}
				],
				"meta": {
					"count": 1
				}
			}
		})
		jest.advanceTimersByTime(DEBOUNCED_WAIT_DURATION)
		await flushPromises()
		jest.advanceTimersByTime(DEBOUNCED_WAIT_DURATION)
		await flushPromises()

		const updates = wrapper.emitted("update:modelValue")
		/*
		 * First update comes from counting initial votes.
		 * Second update comes from asking for archived comments.
		 * Third update comes from after asking for archived comments.
		 * Fourth update comes from counting of votes for archived comments.
		 */
		expect(updates).toHaveLength(4)

		const castFetch = fetch as jest.Mock<any, any>
		expect(castFetch).toHaveBeenCalledTimes(3)
		const [ [ firstRequest ], [ secondRequest ], [ thirdRequest] ] = castFetch.mock.calls
		expect(firstRequest).toHaveProperty("method", "GET")
		expect(firstRequest).toHaveProperty("url", specializePath(COUNT_COMMENT_VOTES, {
			"query": stringifyQuery({
				"filter": {
					"IDs": [ commentID ]
				}
			})
		}))
		expect(firstRequest.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
		expect(firstRequest.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)
		expect(secondRequest).toHaveProperty("method", "GET")
		expect(secondRequest).toHaveProperty("url", specializePath(COMMENT_LINK.query, {
			"query": stringifyQuery({
				"filter": {
					"existence": "archived",
					postID
				},
				"page": {
					"limit": DEFAULT_LIST_LIMIT,
					"offset": modelValue.data.length
				},
				"sort": "-createdAt"
			})
		}))
		expect(secondRequest.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
		expect(secondRequest.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)
		expect(thirdRequest).toHaveProperty("method", "GET")
		expect(thirdRequest).toHaveProperty("url", specializePath(COUNT_COMMENT_VOTES, {
			"query": stringifyQuery({
				"filter": {
					"IDs": [ archivedCommentID ]
				}
			})
		}))
		expect(thirdRequest.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
		expect(thirdRequest.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)
	})

	it("should load other comments", async() => {
		jest.useFakeTimers()
		const userID = "1"
		const commentID = "2"
		const postID = "3"
		const otherCommentID = "4"
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
				"count": 2
			}
		} as DeserializedCommentListDocument<"user">
		const otherList = {
			"data": [
				{
					"content": "foo bar",
					"deletedAt": null,
					"id": otherCommentID,
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
				"count": 2
			}
		} as DeserializedCommentListDocument<"user">
		fetchMock.mockResponseOnce(JSON.stringify({
			"data": [
				{
					"id": commentID,
					"meta": {},
					"type": "comment"
				}
			]
		}), { "status": RequestEnvironment.status.OK })
		fetchMock.mockResponseOnce(
			JSON.stringify(otherList),
			{ "status": RequestEnvironment.status.OK }
		)
		fetchMock.mockResponseOnce(JSON.stringify({
			"data": [
				{
					"id": otherCommentID,
					"meta": {},
					"type": "comment"
				}
			]
		}), { "status": RequestEnvironment.status.OK })

		const wrapper = shallowMount<any>(Component, {
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
					"Suspensible": false
				}
			},
			"props": {
				"isPostOwned": true,
				"mayViewArchivedOrRestore": false,
				modelValue,
				"post": {
					"id": postID
				}
			}
		})

		jest.advanceTimersByTime(DEBOUNCED_WAIT_DURATION)
		await flushPromises()
		const loadOtherCommentButton = wrapper.find(".load-others button")
		await loadOtherCommentButton.trigger("click")
		await flushPromises()
		await wrapper.setProps({
			"modelValue": {
				"data": [
					{
						...modelValue.data,
						"meta": {}
					},
					...otherList.data
				],
				"meta": {
					"count": 2
				}
			}
		})
		jest.advanceTimersByTime(DEBOUNCED_WAIT_DURATION)
		await flushPromises()
		jest.advanceTimersByTime(DEBOUNCED_WAIT_DURATION)
		await flushPromises()

		const updates = wrapper.emitted("update:modelValue")
		/*
		 * First update comes from counting initial votes.
		 * Second update comes from asking for other comments.
		 * Third update comes from asking for vote counts of other comments.
		 */
		expect(updates).toHaveLength(3)

		const castFetch = fetch as jest.Mock<any, any>
		expect(castFetch).toHaveBeenCalledTimes(3)
		const [ [ firstRequest ], [ secondRequest ], [ thirdRequest] ] = castFetch.mock.calls
		expect(firstRequest).toHaveProperty("method", "GET")
		expect(firstRequest).toHaveProperty("url", specializePath(COUNT_COMMENT_VOTES, {
			"query": stringifyQuery({
				"filter": {
					"IDs": [ commentID ]
				}
			})
		}))
		expect(firstRequest.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
		expect(firstRequest.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)
		expect(secondRequest).toHaveProperty("method", "GET")
		expect(secondRequest).toHaveProperty("url", specializePath(COMMENT_LINK.query, {
			"query": stringifyQuery({
				"filter": {
					"existence": "exists",
					postID
				},
				"page": {
					"limit": DEFAULT_LIST_LIMIT,
					"offset": modelValue.data.length
				},
				"sort": "-createdAt"
			})
		}))
		expect(secondRequest.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
		expect(secondRequest.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)
		expect(thirdRequest).toHaveProperty("method", "GET")
		expect(thirdRequest).toHaveProperty("url", specializePath(COUNT_COMMENT_VOTES, {
			"query": stringifyQuery({
				"filter": {
					"IDs": [ otherCommentID ]
				}
			})
		}))
		expect(thirdRequest.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
		expect(thirdRequest.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)
	})
})
