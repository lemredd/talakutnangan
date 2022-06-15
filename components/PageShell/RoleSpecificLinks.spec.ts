import { mount, VueWrapper } from "@vue/test-utils"
import RoleSpecificLinks from "./RoleSpecificLinks.vue"

let wrapper: VueWrapper

describe("Component: Page Shell/Role Specific Links", () => {
	beforeAll(() => {
		wrapper = mount(RoleSpecificLinks, {
			shallow: true,
			global: {
				stubs: {
					RoleLinksList: false
				}
			},
			props: {
				role: "student_or_employee"
			}
		})
	})

	it("should have a menu button that is clickable", async () => {
		const menuButton = wrapper.find("#menu-btn")
		await menuButton.trigger("click")

		expect(wrapper.emitted().click).toHaveLength(1)
	})

	it("should specify the right link/s for a specific role", async () => {
		const link = wrapper.find("link-stub:first-of-type")
		const linkHref = link.attributes("href")
		const specifiedRole = wrapper.props().role

		if(specifiedRole !== "guest") expect(linkHref).toBe("/notifications")
		else expect(linkHref).toBe("/log_in")
	})
})
