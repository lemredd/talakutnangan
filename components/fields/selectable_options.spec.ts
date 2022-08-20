import { shallowMount } from "@vue/test-utils"
import Component from "@/fields/selectable_options.vue"

describe("Component/Fields: Selectable options", () => {
	it("should emit custom event", async() => {
		const wrapper = shallowMount(Component, {
			"props": {
				"label": "Sample select",
				"options": [ 1, 2, 3 ],
				"modelValue": null
			}
		})

		const select = wrapper.find("select")
		await select.setValue(2)

		const updates = wrapper.emitted()
		expect(updates).toHaveProperty("update:modelValue")
	})

	it("should identify initial value", () => {
		const options = [ 1, 2, 3 ]
		const [ modelValue ]= options
		const wrapper = shallowMount(Component, {
			"props": {
				"label": "Sample select",
				modelValue,
				options
			}
		})

		const select = wrapper.find("select").element as HTMLSelectElement
		const identifiedInitialValue = select.value

		expect(Number(identifiedInitialValue)).toEqual(Number(modelValue))
	})
})
