import { shallowMount } from "@vue/test-utils"

import Component from "./minor_dropdown.vue"

describe("Component: helpers/minor_dropdown", () => {
	it("should toggle dropdown", async() => {
		const wrapper = shallowMount(Component, {
			"props": {
				"modelValue": false
			}
		})

		const toggler = wrapper.find(".container > button")
		await toggler.trigger("click")

		expect(wrapper.emitted()).toHaveProperty("update:modelValue.0.0", true)
	})

	it("should close if click emitted outside of dropdown", async() => {
		const wrapper = shallowMount(Component, {
			"props": {
				"modelValue": true
			}
		})

		const toggler = wrapper.find(".container")
		await toggler.trigger("blur")

		expect(wrapper.emitted()).toHaveProperty("update:modelValue.0.0", false)
	})
})
