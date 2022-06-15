import { mount } from "@vue/test-utils"
import RoleSpecificLinks from "./RoleSpecificLinks.vue"
import { ref } from "vue"

describe("Component: Page Shell/Role Specific Links", () => {
	it("should have a menu button that is clickable", async () => {
		const wrapper = mount(RoleSpecificLinks, {
			shallow: true,
			global: {
				stubs: {
					RoleLinksList: false
				},
				provide: {
					bodyClasses: ref<string[]>(["dark"])
				}
			},
			props: {
				role: "student_or_employee"
			}
		})
		const menuButton = wrapper.find("#menu-btn")
		await menuButton.trigger("click")

		expect(wrapper.emitted()).toHaveProperty("click")
	})

	it("should specify the right link/s for a non-guest role", async () => {
		const wrapper = mount(RoleSpecificLinks, {
			shallow: true,
			global: {
				stubs: {
					RoleLinksList: false
				},
				provide: {
					bodyClasses: ref<string[]>(["dark"])
				}
			},
			props: {
				role: "student_or_employee"
			}
		})
		const menuButton = wrapper.find("#menu-btn")
		await menuButton.trigger("click")
		const link = wrapper.find("link-stub:first-of-type")
		const linkHref = link.attributes("href")

		expect(linkHref).toBe("/notifications")
	})

	it("should specify the right link/s for a guest role", async () => {
		const wrapper = mount(RoleSpecificLinks, {
			shallow: true,
			global: {
				stubs: {
					RoleLinksList: false
				},
				provide: {
					bodyClasses: ref<string[]>(["dark"])
				}
			},
			props: {
				role: "guest"
			}
		})
		const menuButton = wrapper.find("#menu-btn")
		await menuButton.trigger("click")
		const link = wrapper.find("link-stub:first-of-type")
		const linkHref = link.attributes("href")

		expect(linkHref).toBe("/log_in")
	})
})
