import { shallowMount } from "@vue/test-utils"

import Component from "./selectable_checkbox.vue"

describe("Component: comment/multiviewer/viewer/checkbox", () => {
	it("can update", async() => {
		const values = [] as string[]
		const checkboxValue = "upvote"
		const wrapper = shallowMount<any>(Component, {
			"global": {
				"stubs": {
					"Suspensible": false
				}
			},
			"props": {
				"isLoaded": true,
				"label": "View",
				"modelValue": values
			}
		})

		const field = wrapper.find("input")
		await field.setValue(true)

		const updates = wrapper.emitted("update:modelValue") as string[][]
		expect(updates).toHaveLength(1)
		const updatedValues = updates[0] as string[]

		expect(updatedValues[0].includes(checkboxValue)).toBeTruthy()
	})

	it("should check upon prop update", async() => {
		const values = [ "view", "create" ]
		const wrapper = shallowMount<any>(Component, {
			"global": {
				"stubs": {
					"Suspensible": false
				}
			},
			"props": {
				"isLoaded": true,
				"label": "View",
				"modelValue": values
			}
		})

		const newValues = [ "view" ]
		await wrapper.setProps({
			"label": "View",
			"modelValue": newValues
		})

		const field = wrapper.find("input").element as HTMLInputElement
		expect(field.checked).toBeFalsy()
	})
})
