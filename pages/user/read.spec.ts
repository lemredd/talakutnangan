import { flushPromises, mount } from "@vue/test-utils"

import RequestEnvironment from "$/singletons/request_environment"

import Page from "./read.page.vue"

describe("Page: user/read", () => {
	it("can populate fields using pre-loaded data", () => {
		const roles = {
			"data": [
				{
					"id": "1",
					"name": "Sample Role 1"
				},
				{
					"id": "2",
					"name": "Sample Role 2"
				},
				{
					"id": "3",
					"name": "Sample Role 3"
				}
			]
		}
		const departments = {
			"data": [
				{
					"fullName": "Sample Test Department",
					"id": "1"
				},
				{
					"fullName": "Sample Test Department aijveorivj",
					"id": "2"
				}
			]
		}
		const userRoles = {
			"data": [ roles.data[0] ]
		}
		const userDepartment = {
			"data": departments.data[0]
		}
		const user = {
			"data": {
				"department": userDepartment,
				"name": "Sample User",
				"roles": userRoles
			}
		}
		const wrapper = mount(Page, {
			"global": {
				"provide": {
					"pageContext": {
						"pageProps": {
							departments,
							roles,
							user
						}
					}
				}
			}
		})
		const userNameInput = wrapper.find(".user-name input").element as HTMLInputElement
		const selectedRoles = wrapper.findAll(".selected-options li")
		const selectedDepartment
		= wrapper.find(".selectable-department select").element as HTMLSelectElement

		expect(userNameInput.value).toEqual(user.data.name)
		selectedRoles.forEach(
			(role, index) => expect(role.text()).toContain(userRoles.data[index].name)
		)
		expect(selectedDepartment.value).toEqual(userDepartment.data.id)
	})

