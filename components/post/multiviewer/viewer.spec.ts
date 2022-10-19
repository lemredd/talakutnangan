import { shallowMount } from "@vue/test-utils"

import type { DeserializedPostResource } from "$/types/documents/post"
import type { DeserializedUserDocument } from "$/types/documents/user"

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
				"modelValue": {
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

		const menu = wrapper.findComponent({ "name": "Menu" })
		await menu.vm.$emit("updatePost")

		const castWrapper = wrapper.vm as any
		expect(castWrapper.mustUpdate).toBeTruthy()
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
