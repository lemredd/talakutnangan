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
	it("should have first tab initially active", () => {
		const wrapper = mount(Tab, {
			"global": {
				"provide": {
					"pageContext": {
						"urlPathname": TAB_1.path
					},
					"tabs": [ TAB_1, TAB_2 ]
				}
			}
		})

		const firstLink = wrapper.find(".anchor")

		expect(firstLink.classes()).toContain("active")
	})

	it.skip("can go to second tab", async() => {
		const wrapper = mount(Tab, {
			"global": {
				"provide": {
					"pageContext": {
						"urlPathname": TAB_1.path
					},
					"tabs": [ TAB_1, TAB_2 ]
				}
			}
		})

		const secondLink = wrapper.find(".anchor:not(.active)")

		await secondLink.trigger("click")
		window.location.href = `${window.location.href}/tabbed_page/tab2`
		// expect(secondLink.classes()).not.toContain("active")
	})
})
