import { mount } from "@vue/test-utils"
import Tab from "./tabs.vue"

const TAB_1 = {
	"label": "TAB_1",
	"path": "/tabbed_page/tab1"
}
const TAB_2 = {
	"label": "TAB_2",
	"path": "/tabbed_page/tab2"
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
