import { shallowMount } from "@vue/test-utils"

import Anchor from "./anchor.vue"

describe("Component: helpers/anchor", () => {
	it("should be active based on current path", () => {
		const path = "/"
		const wrapper = shallowMount(Anchor, {
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

	it("should not be active if path mismatches", () => {
		const path = "/"
		const wrapper = shallowMount(Anchor, {
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
