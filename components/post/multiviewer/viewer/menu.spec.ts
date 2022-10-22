import { shallowMount } from "@vue/test-utils"

import type { DeserializedPostResource } from "$/types/documents/post"
import type { DeserializedUserDocument } from "$/types/documents/user"
import type { DeserializedDepartmentDocument } from "$/types/documents/department"

import { post as permissionGroup } from "$/permissions/permission_list"
import {
	UPDATE_PERSONAL_POST_ON_OWN_DEPARTMENT,
	ARCHIVE_AND_RESTORE_SOCIAL_POST_ON_OWN_DEPARTMENT,
	ARCHIVE_AND_RESTORE_PERSONAL_POST_ON_OWN_DEPARTMENT
} from "$/permissions/post_combinations"

import Component from "./menu.vue"

describe("Component: post/viewer/menu", () => {
	it("may request for updating the own post", async() => {
		const userID = "1"
		const postID = "2"
		const departmentID = "3"
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
					"department": {
						"data": {
							"acronym": "ABC",
							"fullName": "A B C",
							"id": departmentID,
							"type": "department"
						}
					} as DeserializedDepartmentDocument<"attached">,
					"id": postID,
					"poster": {
						"data": {
							"id": userID,
							"type": "user"
						}
					} as DeserializedUserDocument,
					"type": "post"
				} as DeserializedPostResource<"poster"|"department">
			}
		})

		const toggler = wrapper.find(".toggler button")
		await toggler.trigger("click")
		const updateButton = wrapper.find(".dropdown-container button:nth-child(1)")
		const archiveButton = wrapper.find(".dropdown-container button:nth-child(2)")
		const restoreButton = wrapper.find(".dropdown-container button:nth-child(3)")
		await updateButton.trigger("click")

		expect(archiveButton.exists()).toBeFalsy()
		expect(restoreButton.exists()).toBeFalsy()
		const events = wrapper.emitted("updatePost")
		expect(events).toHaveLength(1)
		expect(events).toHaveProperty("0.0", postID)
	})

	it("cannot request for updating the other's post", async() => {
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
					} as DeserializedUserDocument,
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

	it("may request for archiving own post", async() => {
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
												"postFlags": permissionGroup.generateMask(
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
					} as DeserializedUserDocument,
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

	it("may request for archiving other's post", async() => {
		const userID = "1"
		const postID = "2"
		const otherUserID = "3"
		const departmentID = "4"
		const wrapper = shallowMount<any>(Component, {
			"global": {
				"provide": {
					"pageContext": {
						"pageProps": {
							"userProfile": {
								"data": {
									"department": {
										"data": {
											"id": departmentID,
											"type": "department"
										}
									},
									"id": userID,
									"roles": {
										"data": [
											{
												"id": "1",
												"postFlags": permissionGroup.generateMask(
													...UPDATE_PERSONAL_POST_ON_OWN_DEPARTMENT,
													...ARCHIVE_AND_RESTORE_SOCIAL_POST_ON_OWN_DEPARTMENT
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
					"department": {
						"data": {
							"id": departmentID,
							"type": "department"
						}
					} as DeserializedDepartmentDocument<"attached">,
					"id": postID,
					"poster": {
						"data": {
							"id": otherUserID,
							"type": "user"
						}
					} as DeserializedUserDocument,
					"type": "post"
				} as DeserializedPostResource<"poster"|"department">
			}
		})

		const toggler = wrapper.find(".toggler button")
		await toggler.trigger("click")
		console.log(wrapper.html(), "\n\n\n")
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
