import { mount } from "@vue/test-utils"

import type { LinkInfo } from "$@/types/independent"

import Tab from "./tabs.vue"

const TAB_1: LinkInfo = {
	"icon": "",
	"name": "TAB_1",
	"path": "/tabbed_page/tab1",
	"viewportsAvailable": []
}
const TAB_2: LinkInfo = {
	"icon": "",
	"name": "TAB_2",
	"path": "/tabbed_page/tab2",
	"viewportsAvailable": []
}

describe("Component: Tab", () => {
	it("should have first tab to be initially active", () => {
		const wrapper = mount(Tab, {
			"global": {
				"provide": {
					"pageContext": {
						"urlPathname": TAB_1.path
					}
				}
			},
			"props": {
				"tabs": [ TAB_1, TAB_2 ]
			}
		})

		const firstLink = wrapper.find("li:nth-child(1) .anchor")

		expect(firstLink.classes()).toContain("active")
	})

	it("should have second tab to be initially inactive", () => {
		const wrapper = mount(Tab, {
			"global": {
				"provide": {
					"pageContext": {
						"urlPathname": TAB_1.path
					}
				}
			},
			"props": {
				"tabs": [ TAB_1, TAB_2 ]
			}
		})

		const secondLink = wrapper.find("li:nth-child(2) .anchor")

		expect(secondLink.classes()).not.toContain("active")
	})
})
