import { mount } from "@vue/test-utils"

import "~/setups/database.setup"
import Suspensible from "./suspensible.vue"

describe("UI Component: helpers/suspensible", () => {
	it("should show loaded", () => {
		const wrapper = mount(Suspensible, {
			"props": {
				"isLoaded": true
			}
		})

		const loaded = wrapper.find(".loaded")

		expect(loaded.exists()).toBeTruthy()
	})

	it("should show loading", () => {
		const wrapper = mount(Suspensible, {
			"props": {
				"isLoaded": false
			}
		})

		const loaded = wrapper.find(".loading")

		expect(loaded.exists()).toBeTruthy()
	})
})
