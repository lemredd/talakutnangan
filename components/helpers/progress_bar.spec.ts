import { shallowMount } from "@vue/test-utils"

import Component from "./progress_bar.vue"

describe("Component: Helper/progress bar", () => {
	it("can display current progress", () => {
		const wrapper = shallowMount(Component, {
			"props": {
				"current": 0
			}
		})
		const current = wrapper.find(".current")
		const castedWrapper = wrapper.vm as any

		expect(castedWrapper.max).toEqual(100)
		expect(current.exists()).toBeTruthy()
	})
})
