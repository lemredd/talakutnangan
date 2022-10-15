import { shallowMount } from "@vue/test-utils"

import Component from "./progress_bar.vue"

describe("Component: Helper/progress bar", () => {
	// ? props seems to be undefined. use $attrs temporarily

	it("can display current progress", () => {
		const wrapper = shallowMount(Component, {
			"props": {
				"current": 50
			}
		})
		const progress = wrapper.find("progress")
		const castedWrapper = wrapper.vm as any
		const expectedValue = String(castedWrapper.$attrs.current)

		expect(progress.exists()).toBeTruthy()
		expect(progress.attributes("value")).toEqual(expectedValue)
	})
})
