import { shallowMount } from "@vue/test-utils"
import Component from "./checkbox.vue"

describe("Component: fields/checkbox", () => {
	it("can update", async() => {
		const values = [] as string[]
		const checkboxValue = "view"
		const wrapper = shallowMount(Component, {
			"props": {
				"label": "View",
				"modelValue": values,
				"value": checkboxValue
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
		const checkboxValue = "create"
		const wrapper = shallowMount<any>(Component, {
			"props": {
				"label": "View",
				"modelValue": values,
				"value": checkboxValue
			}
		})

		const newValues = [ "view" ]
		await wrapper.setProps({
			"label": "View",
			"modelValue": newValues,
			"value": checkboxValue
		})

		const field = wrapper.find("input").element as HTMLInputElement
		expect(field.checked).toBeFalsy()
	})
})
