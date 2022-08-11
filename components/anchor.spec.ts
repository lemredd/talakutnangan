import { mount } from "@vue/test-utils"
import Anchor from "./anchor.vue"


describe("Component: Link", () => {
	it("Should be active based on current path", async() => {
		const path = "/"
		const wrapper = mount(Anchor, {
			"attrs": {
				"href": path
			},
			"global": {
				"provide": {
					"pageContext": {
						"urlPathname": path
					}
				}
			}
		})

		expect(wrapper.attributes("class")).toContain("active")
	})

	it("Should not be active if path mismatches", async() => {
		const path = "/"
		const wrapper = mount(Anchor, {
			"attrs": {
				"href": "/about"
			},
			"global": {
				"provide": {
					"pageContext": {
						"urlPathname": path
					}
				}
			}
		})

		expect(wrapper.attributes("class")).not.toContain("active")
	})
})
