import { shallowMount, flushPromises } from "@vue/test-utils"

import type { DeserializedPostListDocument } from "$/types/documents/post"

import { JSON_API_MEDIA_TYPE } from "$/types/server"
import { DEFAULT_LIST_LIMIT } from "$/constants/numerical"
import { DEBOUNCED_WAIT_DURATION } from "$@/constants/time"
import { POST_LINK, COUNT_COMMENTS } from "$/constants/template_links"

import specializePath from "$/helpers/specialize_path"
import resetToMidnight from "$/time/reset_to_midnight"
import stringifyQuery from "$@/fetchers/stringify_query"
import adjustUntilChosenDay from "$/time/adjust_until_chosen_day"
import RequestEnvironment from "$/singletons/request_environment"
import adjustBeforeMidnightOfNextDay from "$/time/adjust_before_midnight_of_next_day"

import { post as permissionGroup } from "$/permissions/permission_list"
import {
	UPDATE_PERSONAL_POST_ON_OWN_DEPARTMENT
} from "$/permissions/post_combinations"

import Component from "./multiviewer.vue"

describe("Component: post/multiviewer", () => {
	it("should load properly", async() => {
		jest.useFakeTimers()
		const userID = "1"
		const postID = "2"
		const modelValue = {
			"data": [
				{
					"content": "Hello world!",
					"deletedAt": null,
					"id": postID,
					"poster": {
						"data": {
							"id": userID,
							"type": "user"
						}
					},
					"type": "post"
				}
			],
			"meta": {
				"count": 1
			}
		} as DeserializedPostListDocument<"poster">
		const departments = {
			"data": [
				{
					"id": "1",
					"type": "department"
				}
			]
		}
		const semesters = {
			"data": [],
			"meta": {
				"count": 0
			}
		}
		fetchMock.mockResponseOnce(JSON.stringify({
			"data": [
				{
					"id": postID,
					"meta": {},
					"type": "post"
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
									"department": {
										"data": departments.data[0]
									},
									"id": userID,
									"roles": {
										"data": [
											{
												"id": "1",
												"postFlags": permissionGroup.generateMask(
													...UPDATE_PERSONAL_POST_ON_OWN_DEPARTMENT
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
				departments,
				modelValue,
				semesters
			}
		})

		jest.advanceTimersByTime(DEBOUNCED_WAIT_DURATION)
		await flushPromises()

		const castFetch = fetch as jest.Mock<any, any>
		expect(castFetch).toHaveBeenCalledTimes(1)
		const [ [ request ] ] = castFetch.mock.calls
		expect(request).toHaveProperty("method", "GET")
		expect(request).toHaveProperty("url", specializePath(COUNT_COMMENTS, {
			"query": stringifyQuery({
				"filter": {
					"IDs": [ postID ]
				}
			})
		}))
		expect(request.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
		expect(request.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)
	})

	it("should load other posts", async() => {
		jest.useFakeTimers()
		const userID = "1"
		const postID = "2"
		const otherPostID = "3"
		const modelValue = {
			"data": [
				{
					"content": "Hello world!",
					"deletedAt": null,
					"id": postID,
					"type": "post",
					"poster": {
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
		} as DeserializedPostListDocument<"poster">
		const otherList = {
			"data": [
				{
					"content": "Foo bar",
					"deletedAt": null,
					"id": otherPostID,
					"poster": {
						"data": {
							"id": userID,
							"type": "user"
						}
					},
					"type": "post"
				}
			],
			"meta": {
				"count": 2
			}
		} as DeserializedPostListDocument<"poster">
		const departments = {
			"data": [
				{
					"id": "1",
					"type": "department"
				}
			]
		}
		const semesters = {
			"data": [],
			"meta": {
				"count": 0
			}
		}
		fetchMock.mockResponseOnce(JSON.stringify({
			"data": [
				{
					"id": postID,
					"meta": {},
					"type": "post"
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
					"id": otherPostID,
					"meta": {},
					"type": "post"
				}
			]
		}), { "status": RequestEnvironment.status.OK })

		const currentDate = new Date()
		const rangeBegin = resetToMidnight(adjustUntilChosenDay(currentDate, 0, -1))
		const rangeEnd = adjustBeforeMidnightOfNextDay(adjustUntilChosenDay(currentDate, 6, 1))

		const wrapper = shallowMount<any>(Component, {
			"global": {
				"provide": {
					"pageContext": {
						"pageProps": {
							"userProfile": {
								"data": {
									"department": {
										"data": departments.data[0]
									},
									"id": userID,
									"roles": {
										"data": [
											{
												"id": "1",
												"postFlags": permissionGroup.generateMask(
													...UPDATE_PERSONAL_POST_ON_OWN_DEPARTMENT
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
				departments,
				modelValue,
				semesters
			}
		})

		jest.advanceTimersByTime(DEBOUNCED_WAIT_DURATION)
		await flushPromises()
		await wrapper.setProps({
			"modelValue": {
				"data": [
					{
						...modelValue.data[0],
						"meta": {}
					}
				],
				"meta": {
					"count": 2
				}
			}
		})
		const loadOtherPostButton = wrapper.find(".load-others button")
		await loadOtherPostButton.trigger("click")
		await flushPromises()
		await wrapper.setProps({
			"modelValue": {
				"data": [
					...modelValue.data,
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
		jest.advanceTimersByTime(DEBOUNCED_WAIT_DURATION)
		await flushPromises()
		await flushPromises()

		const updates = wrapper.emitted("update:modelValue")
		/**
		 * First update is about the count of votes.
		 * Second update is about the asking for other remaining posts.
		 * Third update is about the asking for comment count of other remaining posts.
		 */
		expect(updates).toHaveLength(3)

		const castFetch = fetch as jest.Mock<any, any>
		expect(castFetch).toHaveBeenCalledTimes(3)
		const [ [ firstRequest ], [ secondRequest ], [ thirdRequest] ] = castFetch.mock.calls
		expect(firstRequest).toHaveProperty("method", "GET")
		expect(firstRequest).toHaveProperty("url", specializePath(COUNT_COMMENTS, {
			"query": stringifyQuery({
				"filter": {
					"IDs": [ postID ]
				}
			})
		}))
		expect(firstRequest.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
		expect(firstRequest.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)
		expect(secondRequest).toHaveProperty("method", "GET")
		expect(secondRequest).toHaveProperty("url", specializePath(POST_LINK.query, {
			"query": stringifyQuery({
				"filter": {
					"dateTimeRange": {
						"begin": rangeBegin,
						"end": rangeEnd
					},
					"departmentID": departments.data[0].id,
					"existence": "exists"
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
		expect(thirdRequest).toHaveProperty("url", specializePath(COUNT_COMMENTS, {
			"query": stringifyQuery({
				"filter": {
					"IDs": [ otherPostID ]
				}
			})
		}))
		expect(thirdRequest.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
		expect(thirdRequest.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)
	})
})
