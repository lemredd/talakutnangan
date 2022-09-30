import { shallowMount } from "@vue/test-utils"

import Component from "./content_container.vue"

describe("Component: content container", () => {
	it("can recognize if path is at consultation page", () => {
		const wrapper = shallowMount<any>(Component, {
			"global": {
				"provide": {
					"pageContext": {
						"urlPathname": "/consultation"
					}
				}
			}
		})
		const contentWrapper = wrapper.find(".wrapper")

		expect(contentWrapper.classes()).toContain("consultation")
	})
})
