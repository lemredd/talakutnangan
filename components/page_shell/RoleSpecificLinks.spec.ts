import { mount } from "@vue/test-utils"
import RoleSpecificLinks from "./RoleSpecificLinks.vue"
import { ref } from "vue"

describe("Component: Page Shell/Role Specific Links", () => {
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
				role: "student_or_employee",
				pageProps: {
					parsedUnitError: {}
				}
			}
		})
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
				role: "guest",
				pageProps: {
					parsedUnitError: {}
				}
			}
		})
		const link = wrapper.find("link-stub:first-of-type")
		const linkHref = link.attributes("href")

		expect(linkHref).toBe("/log_in")
	})

	it("should appear different in desktop", () => {
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
				role: "student_or_employee",
				pageProps: {
					parsedUnitError: {}
				}
			}
		})

		const desktopLinks = wrapper.findAll("link-stub")
		expect(desktopLinks.length).toBeGreaterThan(1)
	})
})
