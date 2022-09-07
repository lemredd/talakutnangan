import { shallowMount } from "@vue/test-utils"
import Component from "./dropdown.vue"

describe("Component: Dropdown", () => {
	it("should show dropdown when toggled", async() => {
		const wrapper = shallowMount(Component)

		const toggler = wrapper.find("#dropdown-btn")
		await toggler.trigger("click")

		expect(wrapper.html()).toContain("invisible-closer")
		expect(wrapper.html()).toContain("dropdown-container")
	})

	it("Should close if click emitted outside of dropdown", async() => {
		const wrapper = shallowMount(Component)
		const toggler = wrapper.find("#dropdown-btn")
		await toggler.trigger("click")
		const invisibleCloser = wrapper.find(".invisible-closer")
		await invisibleCloser.trigger("click")

		expect(wrapper.emitted()).toHaveProperty("click")
	})

	it("Should close if window resized", async() => {
		const wrapper = shallowMount(Component)

		const toggler = wrapper.find("#dropdown-btn")
		await toggler.trigger("click")

		window.innerWidth = 800
		window.dispatchEvent(new Event("resize"))

		const updates = wrapper.emitted()
		expect(updates).toHaveProperty("resize")
	})
})
