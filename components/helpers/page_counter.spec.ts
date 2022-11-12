import { shallowMount } from "@vue/test-utils"

import Component from "./page_counter.vue"

describe("Component: page counter", () => {
	it("can generate page count buttons by given count", () => {
		const wrapper = shallowMount(Component, {
			"props": {
				"maxCount": 50
			}
		})

		console.log(wrapper.html(), "\n\n\n")
	})
})
