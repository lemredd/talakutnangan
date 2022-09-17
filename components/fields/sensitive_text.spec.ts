import { shallowMount } from "@vue/test-utils"
import Component from "@/fields/sensitive_text.vue"

describe("Component: fields/sensitive_text", () => {
	it("can update", async() => {
		const samplePassword = "Hello world!"
		const wrapper = shallowMount(Component, {
			"props": {
				"label": "Password",
				"modelValue": "",
				"required": true
			}
		})
		const field = wrapper.find("input[type=password]")

		await field.setValue(samplePassword)

		const updates = wrapper.emitted("update:modelValue") as string[]
		expect(updates).toHaveLength(1)
		expect(updates[0]).toEqual([ samplePassword ])
	})

	it("should request for edit", async() => {
		const wrapper = shallowMount(Component, {
			"props": {
				"editable": true,
				"label": "Password",
				"modelValue": "",
				"required": true
			}
		})

		const editButton = wrapper.find("button")

		await editButton.trigger("click")

		const updates = wrapper.emitted("requestEdit") as string[]
		expect(updates).toHaveLength(1)
	})
})
