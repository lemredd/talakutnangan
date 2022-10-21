import { nextTick } from "vue"
import { shallowMount, flushPromises } from "@vue/test-utils"

import type { DeserializedUserDocument } from "$/types/documents/user"
import type { DeserializedCommentResource } from "$/types/documents/comment"

import { JSON_API_MEDIA_TYPE } from "$/types/server"
import { COMMENT_LINK } from "$/constants/template_links"

import specializePath from "$/helpers/specialize_path"
import RequestEnvironment from "$/singletons/request_environment"

import { comment as permissionGroup } from "$/permissions/permission_list"
import {
	UPDATE_PERSONAL_COMMENT_ON_OWN_DEPARTMENT,
	ARCHIVE_AND_RESTORE_PERSONAL_COMMENT_ON_OWN_DEPARTMENT
} from "$/permissions/comment_combinations"

import Component from "./viewer.vue"

describe("Component: comment/multiviewer/viewer", () => {
	it("should submit comment updates", async() => {
		const userID = "1"
		const commentID = "2"
		const modelValue = {
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
		} as DeserializedCommentResource<"user"|"parentComment">
		fetchMock.mockResponseOnce("", { "status": RequestEnvironment.status.NO_CONTENT })
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
				modelValue
			}
		})

		const menu = wrapper.findComponent({ "name": "Menu" })
		await menu.vm.$emit("updatePost")
		const updatePostForm = wrapper.findComponent({ "name": "UpdatePostForm" })
		await updatePostForm.vm.$emit("submit")
		await flushPromises()

		const castWrapper = wrapper.vm as any
		expect(castWrapper.mustUpdate).toBeTruthy()
		const castFetch = fetch as jest.Mock<any, any>
		expect(castFetch).toHaveBeenCalledTimes(1)
		const [ [ request ] ] = castFetch.mock.calls
		expect(request).toHaveProperty("method", "PATCH")
		expect(request).toHaveProperty("url", specializePath(COMMENT_LINK.bound, { "id": commentID }))
		expect(request.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
		expect(request.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)
		const expectedBody = {
			"data": {
				"attributes": {
					"content": modelValue.content,
					"deletedAt": modelValue.deletedAt
				},
				"id": commentID,
				"relationships": {
					"poster": {
						"data": {
							"id": modelValue.poster.data.id,
							"type": "user"
						}
					},
					"posterRole": {
						"data": {
							"id": modelValue.posterRole.data.id,
							"type": "role"
						}
					}
				},
				"type": "comment"
			}
		}
		expect(await request.json()).toStrictEqual(expectedBody)

		const updateEvent = wrapper.emitted("update:modelValue")
		expect(updateEvent).toHaveProperty("0.0", modelValue)
	})
})
