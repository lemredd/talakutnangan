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
	it("Should have first tab initially active", () => {
		const wrapper = mount(Tab, {
			global: {
				provide: {
					pageContext: {
						urlPathname: "/tabbed_page/tab1"
					},
					tabs: [Tab1.name, Tab2.name]
				}
			}
		})

		const firstLink = wrapper.find(".link")
		console.log(firstLink.html())
		expect(firstLink.classes()).toContain("active")
	})
})
