import { shallowMount } from "@vue/test-utils"
import Component from "./dropdown.vue"

describe("Component: Dropdown", () => {
	it("should toggle dropdown", async() => {
		const wrapper = shallowMount(Component, {
			"props": {
				"isDropdownShown": false
			}
		})

		const toggler = wrapper.find("#dropdown-btn")
		await toggler.trigger("click")
		await wrapper.setProps({ "isDropdownShown": true })

		const invisibleCloser = wrapper.find(".invisible-closer")
		expect(invisibleCloser.exists()).toBeTruthy()
	})

	it("Should close if click emitted outside of dropdown", async() => {
		const wrapper = shallowMount(Component, {
			"props": {
				"isDropdownShown": true
			}
		})

		const toggler = wrapper.find("#dropdown-btn")
		await toggler.trigger("click")
		await wrapper.setProps({ "isDropdownShown": false })

		const invisibleCloser = wrapper.find(".invisible-closer")
		expect(invisibleCloser.exists()).toBeFalsy()
	})

	it("Should close if window resized", async() => {
		const wrapper = shallowMount(Component, {
			"props": {
				"isDropdownShown": true
			}
		})

		const toggler = wrapper.find("#dropdown-btn")
		await toggler.trigger("click")

		window.innerWidth = 800
		window.dispatchEvent(new Event("resize"))

		const updates = wrapper.emitted()
		expect(updates).toHaveProperty("resize")

		await wrapper.setProps({ "isDropdownShown": false })
		const invisibleCloser = wrapper.find(".invisible-closer")
		expect(invisibleCloser.exists()).toBeFalsy()
	})
})
