import { shallowMount } from "@vue/test-utils"

import Component from "./resource_manager.vue"

describe("UI Component: resource_management/resource_manager", () => {
	it("should update department", async() => {
		const departmentID = "1"
		const wrapper = shallowMount(Component, {
			"props": {
				"chosenDepartment": "",
				"departmentNames": [
					{
						"label": "Hello",
						"value": "2"
					},
					{
						"label": "World",
						"value": departmentID
					}
				],
				"isLoaded": true,
				"roleNames": []
			}
		})

		const departmentOptions = wrapper.findComponent({ "name": "SelectableOptionsField" })
		await departmentOptions.setValue(departmentID)

		const updateDepartment = wrapper.emitted("update:chosenDepartment")
		expect(updateDepartment).toHaveProperty("0.0", departmentID)
	})

	it("should update role", async() => {
		const roleID = "1"
		const wrapper = shallowMount(Component, {
			"props": {
				"chosenRole": "",
				"departmentNames": [],
				"isLoaded": true,
				"roleNames": [
					{
						"label": "Hello",
						"value": "2"
					},
					{
						"label": "World",
						"value": roleID
					}
				]
			}
		})

		const roleOptions = wrapper.findComponent({ "name": "SelectableOptionsField" })
		await roleOptions.setValue(roleID)

		const updateRole = wrapper.emitted("update:chosenRole")
		expect(updateRole).toHaveProperty("0.0", roleID)
	})

	it("should update slug", async() => {
		const newSlug = "Hello"
		const wrapper = shallowMount(Component, {
			"props": {
				"departmentNames": [],
				"isLoaded": true,
				"roleNames": [],
				"slug": "World"
			}
		})

		const searchFilter = wrapper.findComponent({ "name": "SearchFilter" })
		await searchFilter.setValue(newSlug)

		const updateRole = wrapper.emitted("update:slug")
		expect(updateRole).toHaveProperty("0.0", newSlug)
	})
})
