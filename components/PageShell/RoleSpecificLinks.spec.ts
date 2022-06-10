import { mount, VueWrapper } from "@vue/test-utils"
import RoleSpecificLinks from "./RoleSpecificLinks.vue"

let wrapper: VueWrapper

describe("Component: Page Shell/Role Specific Links", () => {
	beforeAll(() => {
		wrapper = mount(RoleSpecificLinks, {
			shallow: true,
			props: {
				role: "student_or_employee"
			}
		})
	})

	it("should specify the right link/s for a specific role", async () => {
		const link = wrapper.find(".role-links link-stub:first-of-type")
		const linkHref = link.attributes("href")
		const specifiedRole = wrapper.props().role

		switch (specifiedRole) {
			case "student_or_employee":
				expect(linkHref).toBe("/consultations")
				break
			case "user_manager":
				expect(linkHref).toBe("/consultations")
				break
			case "admin":
				expect(linkHref).toBe("/manage")
				break
			default:
				expect(linkHref).toBe("/log_in")
		}
	})

