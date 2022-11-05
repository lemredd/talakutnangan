import { faker } from "@faker-js/faker"
import flushPromises from "flush-promises"
import { shallowMount } from "@vue/test-utils"

import { POST_LINK } from "$/constants/template_links"

import RequestEnvironment from "$/singletons/request_environment"
import { post as permissionGroup } from "$/permissions/permission_list"
import {
	CREATE_SOCIAL_POST_ON_OWN_DEPARTMENT,
	CREATE_PUBLIC_POST_ON_ANY_DEPARTMENT
} from "$/permissions/post_combinations"

import Component from "./create_post_form.vue"

describe("Component: post/create_post_form", () => {
	it("may select one of the multiple roles but for one department", async() => {
		const departmentAResource = {
			"id": "3",
			"name": "C"
		}
		const roleResourceA = {
			"id": "1",
			"name": "A",
			"postFlags": permissionGroup.generateMask(...CREATE_PUBLIC_POST_ON_ANY_DEPARTMENT)
		}
		const roleResourceB = {
			"id": "2",
			"name": "B",
			"postFlags": permissionGroup.generateMask(...CREATE_SOCIAL_POST_ON_OWN_DEPARTMENT)
		}
		const wrapper = shallowMount<any>(Component, {
			"global": {
				"provide": {
					"pageContext": {
						"pageProps": {
							"departments": [],
							"userProfile": {
								"data": {
									"department": {
										"data": departmentAResource
									},
									"roles": {
										"data": [
											roleResourceA,
											roleResourceB
										]
									}
								}
							}
						}
					}
				},
				"stubs": {
					"DraftForm": false,
					"Overlay": false
				}
			},
			"props": {
				"isShown": true
			}
		})
		const roleOptionsField = wrapper
		.find(".role-selector")
		.findComponent({ "name": "SelectableOptionsField" })

		await roleOptionsField.setValue(roleResourceB.id)

		const departmentOptionsField = wrapper
		.find(".department-selector")
		expect(roleOptionsField.exists()).toBeTruthy()
		expect(departmentOptionsField.exists()).toBeFalsy()
	})

	it("may select one of the multiple roles and any department", async() => {
		const departmentAResource = {
			"id": "3",
			"name": "C"
		}
		const departmentBResource = {
			"id": "4",
			"name": "D"
		}
		const roleResourceA = {
			"id": "1",
			"name": "A",
			"postFlags": permissionGroup.generateMask(...CREATE_PUBLIC_POST_ON_ANY_DEPARTMENT)
		}
		const roleResourceB = {
			"id": "2",
			"name": "B",
			"postFlags": permissionGroup.generateMask(...CREATE_SOCIAL_POST_ON_OWN_DEPARTMENT)
		}
		const wrapper = shallowMount<any>(Component, {
			"global": {
				"provide": {
					"pageContext": {
						"pageProps": {
							"departments": [ departmentAResource, departmentBResource ],
							"userProfile": {
								"data": {
									"department": {
										"data": departmentAResource
									},
									"roles": {
										"data": [
											roleResourceB,
											roleResourceA
										]
									}
								}
							}
						}
					}
				},
				"stubs": {
					"DraftForm": false,
					"Overlay": false
				}
			},
			"props": {
				"isShown": true
			}
		})
		const roleOptionsField = wrapper
		.find(".role-selector")
		.findComponent({ "name": "SelectableOptionsField" })

		await roleOptionsField.setValue(roleResourceA.id)

		const departmentOptionsField = wrapper
		.find(".department-selector")
		.findComponent({ "name": "SelectableOptionsField" })
		expect(roleOptionsField.exists()).toBeTruthy()
		expect(departmentOptionsField.exists()).toBeTruthy()
	})

	it.only("may submit to any department but only one role", async() => {
		fetchMock.mockResponseOnce(
			"",
			{ "status": RequestEnvironment.status.NO_CONTENT }
		)
		const departmentAResource = {
			"id": "3",
			"name": "C"
		}
		const departmentBResource = {
			"id": "4",
			"name": "D"
		}
		const roleResourceA = {
			"id": "1",
			"name": "A",
			"postFlags": permissionGroup.generateMask(...CREATE_PUBLIC_POST_ON_ANY_DEPARTMENT)
		}
		const userID = "2"
		const wrapper = shallowMount<any>(Component, {
			"global": {
				"provide": {
					"pageContext": {
						"pageProps": {
							"departments": [ departmentAResource, departmentBResource ],
							"userProfile": {
								"data": {
									"department": {
										"data": departmentAResource
									},
									"id": userID,
									"roles": {
										"data": [
											roleResourceA
										]
									}
								}
							}
						}
					}
				},
				"stubs": {
					"DraftForm": false,
					"Overlay": false
				}
			},
			"props": {
				"isShown": true
			}
		})
		const roleOptionsField = wrapper
		.find(".role-selector")
		const departmentOptionsField = wrapper
		.find(".department-selector")
		.findComponent({ "name": "SelectableOptionsField" })
		const contentField = wrapper.find(".post-message")
		const exampleContent = faker.lorem.paragraphs(2)
		await contentField.setValue(exampleContent)

		const createPostForm = wrapper.find("form")
		await createPostForm.trigger("submit")
		await flushPromises()

		expect(roleOptionsField.exists()).toBeFalsy()
		expect(departmentOptionsField.exists()).toBeTruthy()
		const castFetch = fetch as jest.Mock<any, any>
		const [ [ firstRequest ] ] = castFetch.mock.calls
		expect(firstRequest).toHaveProperty("method", "POST")
		expect(firstRequest).toHaveProperty("url", POST_LINK.unbound)
		const firstRequestBody = await firstRequest.json()
		expect(firstRequestBody).toHaveProperty("data.type", "post")
		expect(firstRequestBody).toHaveProperty(
			"data.relationships.department.data.id",
			departmentAResource.id
		)
		expect(firstRequestBody).not.toHaveProperty("data.relationships.postAttachments.data")
		expect(firstRequestBody).toHaveProperty("data.relationships.poster.data.id", userID)
		expect(firstRequestBody).toHaveProperty(
			"data.relationships.posterRole.data.id",
			roleResourceA.id
		)
	})
})
