import { shallowMount } from "@vue/test-utils"

import Component from "./extra_controls.vue"

describe("Component: chat_window/extra_controls", () => {
	it("should emit custom events", async() => {
		const wrapper = shallowMount(Component, {
			"props": {
				"isCurrentUserConsultant": true,
				"isHeaderControlDropdownShown": true
			}
		})


	})
})
