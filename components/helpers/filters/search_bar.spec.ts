import { shallowMount } from "@vue/test-utils"
import Component from "./search_bar.vue"

describe("Component: Search Bar", () => {
	it("should emit with a string value", async() => {
		const wrapper = shallowMount(Component, {
			"props": {
				"modelValue": "foo"
			}
		})
		const textField = wrapper.find(".search-filter")
		const slug = "hello"

		await textField.setValue(slug)

		expect(wrapper.emitted("update:modelValue")).toStrictEqual([ [ slug ] ])
	})
})
