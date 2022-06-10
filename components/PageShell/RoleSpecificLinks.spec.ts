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
