import { mount } from "@vue/test-utils"
import Checkbox from "./checkbox.vue"

describe("Component: fields/checkbox", () => {
	it("can update", async () => {
		const values = new Set<string>()
		const checkboxValue = "view"
		const wrapper = mount(Checkbox, {
			props: {
				label: "View",
				value: checkboxValue,
				modelValue: values,
			}
		})

		const field = wrapper.find("input")
		await field.setValue(true)

		const updates = wrapper.emitted("update:modelValue")
		expect(updates).toHaveLength(1)
		const updatedValues = (updates![0] as [Set<string>])
		expect(updatedValues[0].has(checkboxValue)).toBeTruthy()
	})
})