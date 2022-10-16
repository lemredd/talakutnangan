import { faker } from "@faker-js/faker"
import { shallowMount } from "@vue/test-utils"

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
			"post": permissionGroup.generateMask(...CREATE_PUBLIC_POST_ON_ANY_DEPARTMENT)
		}
		const roleResourceB = {
			"id": "2",
			"name": "B",
			"post": permissionGroup.generateMask(...CREATE_SOCIAL_POST_ON_OWN_DEPARTMENT)
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
		const firstSelectableOptionsField = wrapper
		.find(".role-selector")
		.findComponent({ "name": "SelectableOptionsField" })

		await firstSelectableOptionsField.setValue(roleResourceB.id)

		const secondSelectableOptionsField = wrapper
		.find(".department-selector")
		.findComponent({ "name": "SelectableOptionsField" })
		expect(firstSelectableOptionsField.exists()).toBeTruthy()
		expect(secondSelectableOptionsField.exists()).toBeFalsy()
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
			"post": permissionGroup.generateMask(...CREATE_PUBLIC_POST_ON_ANY_DEPARTMENT)
		}
		const roleResourceB = {
			"id": "2",
			"name": "B",
			"post": permissionGroup.generateMask(...CREATE_SOCIAL_POST_ON_OWN_DEPARTMENT)
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
		const firstSelectableOptionsField = wrapper
		.find(".role-selector")
		.findComponent({ "name": "SelectableOptionsField" })

		await firstSelectableOptionsField.setValue(roleResourceA.id)

		const secondSelectableOptionsField = wrapper
		.find(".department-selector")
		.findComponent({ "name": "SelectableOptionsField" })
		expect(firstSelectableOptionsField.exists()).toBeTruthy()
		expect(secondSelectableOptionsField.exists()).toBeTruthy()
	})
})
