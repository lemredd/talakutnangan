import { shallowMount } from "@vue/test-utils"
import Overlay from "./overlay.vue"

describe("Component: helpers/overlay", () => {
	it("should close on click of background", async() => {
		const wrapper = shallowMount(Overlay, {
			"props": {
				"isShown": true
			}
		})
		const overlay = wrapper.find(".overlay")
		await overlay.trigger("click")
		expect(wrapper.emitted()).toHaveProperty("close")
	})

	it("should close on click of close button", async() => {
		const wrapper = shallowMount(Overlay, {
			"props": {
				"isShown": true
			}
		})
		const closeButton = wrapper.find(".close-btn")
		await closeButton.trigger("click")
		expect(wrapper.emitted()).toHaveProperty("close")
	})
})
