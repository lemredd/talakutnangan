import { faker } from "@faker-js/faker"
import { shallowMount } from "@vue/test-utils"

import { post as permissionGroup } from "$/permissions/permission_list"
import {
	CREATE_SOCIAL_POST_ON_OWN_DEPARTMENT,
	CREATE_PUBLIC_POST_ON_ANY_DEPARTMENT
} from "$/permissions/post_combinations"

import Component from "./create_post_form.vue"

describe("Component: post/create_post_form", () => {
	it("may select one of the multiple roles", async() => {
		const departmentResource = {
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
										"data": departmentResource
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
		const field = wrapper.findComponent({ "name": "SelectableOptionsField" })

		expect(field.exists()).toBeTruthy()
	})
})
