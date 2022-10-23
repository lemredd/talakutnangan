import { shallowMount } from "@vue/test-utils"

import type { DeserializedUserDocument } from "$/types/documents/user"
import type { DeserializedCommentResource } from "$/types/documents/comment"

import { comment } from "$/permissions/permission_list"
import {
	UPDATE_PERSONAL_COMMENT_ON_OWN_DEPARTMENT,
	ARCHIVE_AND_RESTORE_PERSONAL_COMMENT_ON_OWN_DEPARTMENT
} from "$/permissions/comment_combinations"

import Component from "./menu.vue"

describe("Component: comment/multiviewer/viewer/menu", () => {
	it("should request for editing the comment", async() => {
		const userID = "1"
		const commentID = "2"
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
												"commentFlags": comment.generateMask(
													...UPDATE_PERSONAL_COMMENT_ON_OWN_DEPARTMENT
												),
												"id": "1"
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
					"IconButton": false,
					"MinorDropdown": false
				}
			},
			"props": {
				"comment": {
					"content": "Hello world!",
					"deletedAt": null,
					"id": commentID,
					"type": "comment",
					"user": {
						"data": {
							"id": userID,
							"type": "user"
						}
					} as DeserializedUserDocument<"roles">
				} as DeserializedCommentResource<"user">
			}
		})

		const toggler = wrapper.find(".container > .material-icons:nth-child(1)")
		await toggler.trigger("click")
		const updateButton = wrapper.find(".dropdown-container button:nth-child(1)")
		const archiveButton = wrapper.find(".dropdown-container button:nth-child(2)")
		const restoreButton = wrapper.find(".dropdown-container button:nth-child(3)")
		await updateButton.trigger("click")

		expect(archiveButton.exists()).toBeFalsy()
		expect(restoreButton.exists()).toBeFalsy()
		const events = wrapper.emitted("updateComment")
		expect(events).toHaveLength(1)
		expect(events).toHaveProperty("0.0", commentID)
	})

	it("should request for archiving the comment", async() => {
		const userID = "1"
		const commentID = "2"
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
												"commentFlags": comment.generateMask(
													...UPDATE_PERSONAL_COMMENT_ON_OWN_DEPARTMENT,
													...ARCHIVE_AND_RESTORE_PERSONAL_COMMENT_ON_OWN_DEPARTMENT
												),
												"id": "1"
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
					"IconButton": false,
					"MinorDropdown": false
				}
			},
			"props": {
				"comment": {
					"content": "Hello world!",
					"deletedAt": null,
					"id": commentID,
					"type": "comment",
					"user": {
						"data": {
							"id": userID,
							"type": "user"
						}
					} as DeserializedUserDocument<"roles">
				} as DeserializedCommentResource<"user">
			}
		})

		const toggler = wrapper.find(".container > .material-icons:nth-child(1)")
		await toggler.trigger("click")
		const updateButton = wrapper.find(".dropdown-container button:nth-child(1)")
		const archiveButton = wrapper.find(".dropdown-container button:nth-child(2)")
		const restoreButton = wrapper.find(".dropdown-container button:nth-child(3)")
		await archiveButton.trigger("click")

		expect(await updateButton.exists()).toBeTruthy()
		expect(await restoreButton.exists()).toBeFalsy()
		const events = wrapper.emitted("archiveComment")
		expect(events).toHaveLength(1)
		expect(events).toHaveProperty("0.0", commentID)
	})

	it("should hide if nothing is permitted", () => {
		const userID = "1"
		const commentID = "2"
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
												"commentFlags": comment.generateMask(),
												"id": "1"
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
					"IconButton": false,
					"MinorDropdown": false
				}
			},
			"props": {
				"comment": {
					"content": "Hello world!",
					"deletedAt": null,
					"id": commentID,
					"type": "comment",
					"user": {
						"data": {
							"id": userID,
							"type": "user"
						}
					} as DeserializedUserDocument<"roles">
				} as DeserializedCommentResource<"user">
			}
		})

		const button = wrapper.find(".container > .material-icons:nth-child(1)")
		const doesExists = button.exists()

		expect(doesExists).toBeFalsy()
	})
})
