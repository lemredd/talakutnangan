import { shallowMount } from "@vue/test-utils"

import Component from "./minor_dropdown.vue"

describe("Component: helpers/minor_dropdown", () => {
	it("should toggle dropdown", async() => {
		const wrapper = shallowMount(Component, {
			"props": {
				"modelValue": false
			}
		})

		const container = wrapper.findComponent({ "name": "IconButton" })
		await container.vm.$emit("iconClick")

		expect(wrapper.emitted()).toHaveProperty("update:modelValue.0.0", true)
	})

	it("should close if click emitted outside of dropdown", async() => {
		const wrapper = shallowMount(Component, {
			"props": {
				"modelValue": true
			}
		})

		const container = wrapper.findComponent({ "name": "IconButton" })
		await container.vm.$emit("focusout")

		expect(wrapper.emitted()).toHaveProperty("update:modelValue.0.0", false)
	})
})
