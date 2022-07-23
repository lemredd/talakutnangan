import { mount } from "@vue/test-utils"
import Tab from "./tab.vue"

const Tab1 = {
	name: "Tab1",
	template: `<div>hello from Tab1</div>`
}
const Tab2 = {
	name: "Tab2",
	template: `<div>hello from Tab2</div>`
}

describe("Component: Tab", () => {
	it("Should have first tab initially activ", () => {
		const wrapper = mount(Tab, {
			shallow: true,
			global: {
				provide: {
					url: "Tab1",
					pageContext: {
						urlPathname: "/sample"
					}
				}
			},
			props: {
				tabs: {
					Tab1,
					Tab2
				}
			}
		})

		const tabButtons = wrapper.findAll(".tab-button")
		expect(tabButtons[0].classes()).toContain("active")
	})

	it("Should be active on click", async () => {
		const wrapper = mount(Tab, {
			shallow: true,
			global: {
				provide: {
					url: "Tab2",
					pageContext: {
						urlPathname: "/sample"
					}
				}
			},
			props: {
				tabs: {
					Tab1,
					Tab2
				}
			}
		})

		const tabButtons = wrapper.findAll(".tab-button")
		await tabButtons[tabButtons.length - 1].trigger("click")
		expect(tabButtons[tabButtons.length - 1].classes()).toContain("active")
	})
})
