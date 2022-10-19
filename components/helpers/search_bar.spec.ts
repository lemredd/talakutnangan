import { mount } from "@vue/test-utils"
import SearchBar from "./search_bar.vue"

describe("Component: Search Bar", () => {
	it("Should emit with a string value", async() => {
		const wrapper = mount(SearchBar)
		const textField = wrapper.find(".search-filter")
		const slug = "hello"

		await textField.setValue(slug)

		expect(wrapper.emitted("update:modelValue")).toStrictEqual([ [ slug ] ])
	})
})
