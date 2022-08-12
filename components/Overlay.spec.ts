import { mount, VueWrapper } from "@vue/test-utils"
import Overlay from "./Overlay.vue"

let wrapper: VueWrapper

describe("Component: Tab", () => {
	beforeAll(() => {
		wrapper = mount(Overlay)
	})

	it("should close on click of background", async() => {
		const overlay = wrapper.find(".overlay")
		await overlay.trigger("click")
		expect(wrapper.emitted()).toHaveProperty("close")
	})
	it("should close on click of close button", async() => {
		const closeButton = wrapper.find(".close-btn")
		await closeButton.trigger("click")
		expect(wrapper.emitted()).toHaveProperty("close")
	})
})
