import { faker } from "@faker-js/faker"
import flushPromises from "flush-promises"
import { shallowMount } from "@vue/test-utils"

import { USER_LINK } from "$/constants/template_links"

import specializePath from "$/helpers/specialize_path"
import RequestEnvironment from "$/singletons/request_environment"
import { post as permissionGroup } from "$/permissions/permission_list"
import {
	CREATE_SOCIAL_POST_ON_OWN_DEPARTMENT,
	CREATE_PUBLIC_POST_ON_ANY_DEPARTMENT
} from "$/permissions/post_combinations"

import Component from "./update_post_form.vue"

describe("Component: post/multiview/viewer/update_post_form", () => {
	it("must request upon showing", async() => {
		const departmentResourceA = {
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
		const userID = "5"
		fetchMock.mockResponseOnce(
			JSON.stringify({
				"data": {
					"id": userID,
					"relationships": {
						"department": {
							"data": {
								"id": departmentResourceA.id,
								"type": "department"
							}
						},
						"roles": {
							"data": [
								{
									"id": roleResourceA.id,
									"type": "role"
								},
								{
									"id": roleResourceB.id,
									"type": "role"
								}
							]
						}
					},
					"type": "user"
				},
				"included": [
					{
						"attributes": {
							"name": departmentResourceA.name
						},
						"id": departmentResourceA.id,
						"type": "department"
					},
					{
						"attributes": {
							"name": roleResourceA.name,
							"postFlags": roleResourceA.postFlags
						},
						"id": roleResourceA.id,
						"type": "role"
					},
					{
						"attributes": {
							"name": roleResourceB.name,
							"postFlags": roleResourceB.postFlags
						},
						"id": roleResourceB.id,
						"type": "role"
					}
				]
			}),
			{ "status": RequestEnvironment.status.OK }
		)
		const wrapper = shallowMount<any>(Component, {
			"global": {
				"stubs": {
					"DraftForm": false,
					"Overlay": false
				}
			},
			"props": {
				"isShown": false,
				"modelValue": {
					"content": faker.lorem.paragraph(),
					"poster": {
						"data": {
							"id": userID
						}
					},
					"posterRole": {
						"data": roleResourceB
					}
				}
			}
		})

		await wrapper.setProps({ "isShown": true })
		await flushPromises()

		const castFetch = fetch as jest.Mock<any, any>
		const [ [ firstRequest ] ] = castFetch.mock.calls
		expect(firstRequest).toHaveProperty("method", "GET")
		expect(firstRequest).toHaveProperty("url", specializePath(USER_LINK.bound, {
			"id": userID
		}))
		const updates = wrapper.emitted("update:modelValue")
		expect(updates).toHaveLength(1)
		expect(updates).toHaveProperty("0.0.poster.data.department")
		expect(updates).toHaveProperty("0.0.poster.data.roles")
	})
})
