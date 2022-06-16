import { DOMWrapper, mount, VueWrapper } from "@vue/test-utils"
import Tab from "./Tab.vue"

let wrapper: VueWrapper
let tabButtons: DOMWrapper<HTMLLIElement>[]
const Tab1 = {
	name: "Tab1",
	template: `<div>hello from Tab1</div>`
}
const Tab2 = {
	name: "Tab2",
	template: `<div>hello from Tab2</div>`
}

describe("Component: Tab", () => {
	beforeAll(() => {
		wrapper = mount(Tab, {
			shallow: true,
			props: {
				tabs: {
					Tab1,
					Tab2
				}
			}
		})

		tabButtons = wrapper.findAll(".tab-button")
	})

	it("Should have first tab initially active", () => {
		expect(tabButtons[0].classes()).toContain("active")
	})

	it("Should be active on click", async () => {
		await tabButtons[tabButtons.length - 1].trigger("click")
		expect(tabButtons[tabButtons.length - 1].classes()).toContain("active")
	})
})
