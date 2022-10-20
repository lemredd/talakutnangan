import { shallowMount, flushPromises } from "@vue/test-utils"

import type { DeserializedPostResource } from "$/types/documents/post"
import type { DeserializedUserDocument } from "$/types/documents/user"
import type { DeserializedRoleDocument } from "$/types/documents/role"

import { JSON_API_MEDIA_TYPE } from "$/types/server"
import { POST_LINK } from "$/constants/template_links"

import specializePath from "$/helpers/specialize_path"
import RequestEnvironment from "$/singletons/request_environment"

import PermissionGroup from "$/permissions/post"
import {
	UPDATE_PERSONAL_POST_ON_OWN_DEPARTMENT,
	ARCHIVE_AND_RESTORE_PERSONAL_POST_ON_OWN_DEPARTMENT
} from "$/permissions/post_combinations"

import Component from "./viewer.vue"

describe("Component: post/viewer", () => {
	it.only("should submit post errors", async() => {
		const userID = "1"
		const postID = "2"
		const roleID = "3"
		const modelValue = {
			"content": "Hello world!",
			"deletedAt": null,
			"id": postID,
			"poster": {
				"data": {
					"id": userID,
					"type": "user"
				}
			} as DeserializedUserDocument<"roles">,
			"posterRole": {
				"data": {
					"id": roleID,
					"type": "role"
				}
			} as DeserializedRoleDocument,
			"type": "post"
		} as DeserializedPostResource<"poster"|"posterRole">
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
												"postFlags": new PermissionGroup().generateMask(
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
		expect(request).toHaveProperty("url", specializePath(POST_LINK.bound, { "id": postID }))
		expect(request.headers.get("Content-Type")).toBe(JSON_API_MEDIA_TYPE)
		expect(request.headers.get("Accept")).toBe(JSON_API_MEDIA_TYPE)
		const expectedBody = {
			"data": {
				"attributes": {
					"content": modelValue.content,
					"deletedAt": modelValue.deletedAt
				},
				"id": postID,
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
				"type": "post"
			}
		}
		expect(await request.json()).toStrictEqual(expectedBody)

		const updateEvent = wrapper.emitted("update:modelValue")
		expect(updateEvent).toHaveProperty("0.0", modelValue)
	})

	it("cannot request for editing the post", async() => {
		const userID = "1"
		const postID = "2"
		const otherUserID = "3"
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
												"postFlags": new PermissionGroup().generateMask(
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
					"Dropdown": false
				}
			},
			"props": {
				"post": {
					"content": "Hello world!",
					"deletedAt": null,
					"id": postID,
					"poster": {
						"data": {
							"id": otherUserID,
							"type": "user"
						}
					} as DeserializedUserDocument<"roles">,
					"type": "post"
				} as DeserializedPostResource<"poster">
			}
		})

		const toggler = wrapper.find(".toggler button")
		await toggler.trigger("click")
		const updateButton = wrapper.find(".dropdown-container button:nth-child(1)")
		const archiveButton = wrapper.find(".dropdown-container button:nth-child(2)")
		const restoreButton = wrapper.find(".dropdown-container button:nth-child(3)")

		expect(updateButton.exists()).toBeFalsy()
		expect(archiveButton.exists()).toBeFalsy()
		expect(restoreButton.exists()).toBeFalsy()
	})

	it("should request for archiving the post", async() => {
		const userID = "1"
		const postID = "2"
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
												"postFlags": new PermissionGroup().generateMask(
													...UPDATE_PERSONAL_POST_ON_OWN_DEPARTMENT,
													...ARCHIVE_AND_RESTORE_PERSONAL_POST_ON_OWN_DEPARTMENT
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
				"post": {
					"content": "Hello world!",
					"deletedAt": null,
					"id": postID,
					"poster": {
						"data": {
							"id": userID,
							"type": "user"
						}
					} as DeserializedUserDocument<"roles">,
					"type": "post"
				} as DeserializedPostResource<"poster">
			}
		})

		const toggler = wrapper.find(".toggler button")
		await toggler.trigger("click")
		const updateButton = wrapper.find(".dropdown-container button:nth-child(1)")
		const archiveButton = wrapper.find(".dropdown-container button:nth-child(2)")
		const restoreButton = wrapper.find(".dropdown-container button:nth-child(3)")
		await archiveButton.trigger("click")

		expect(updateButton.exists()).toBeTruthy()
		expect(restoreButton.exists()).toBeFalsy()
		const events = wrapper.emitted("archivePost")
		expect(events).toHaveLength(1)
		expect(events).toHaveProperty("0.0", postID)
	})
})
