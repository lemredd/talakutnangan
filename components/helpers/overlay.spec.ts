import { mount } from "@vue/test-utils"
import Overlay from "./overlay.vue"

describe("Component: Tab", () => {
	it("should close on click of background", async() => {
		const wrapper = mount(Overlay)
		const overlay = wrapper.find(".overlay")
		await overlay.trigger("click")
		expect(wrapper.emitted()).toHaveProperty("close")
	})

	it("should close on click of close button", async() => {
		const wrapper = mount(Overlay)
		const closeButton = wrapper.find(".close-btn")
		await closeButton.trigger("click")
		expect(wrapper.emitted()).toHaveProperty("close")
	})
})
