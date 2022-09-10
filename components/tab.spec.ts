import { mount } from "@vue/test-utils"
import Tab from "./tab.vue"

const Tab1 = {
	"label": "Tab1",
	"path": "/tabbed_page/tab1"
}
const Tab2 = {
	"label": "Tab2",
	"path": "/tabbed_page/tab2"
}

describe("Component: Tab", () => {
	it("Should have first tab initially active", () => {
		const wrapper = mount(Tab, {
			"global": {
				"provide": {
					"pageContext": {
						"urlPathname": "/tabbed_page/tab1"
					},
					"tabs": [ Tab1, Tab2 ]
				}
			}
		})

		const firstLink = wrapper.find(".anchor")
		expect(firstLink.classes()).toContain("active")
	})
})
