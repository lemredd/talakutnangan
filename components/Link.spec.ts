import { mount } from "@vue/test-utils"
import Link from "./Link.vue"


describe("Component: Link", () => {
		const wrapper = mount(Link, {
			attrs: {
				href: path
			},
			global: {
				provide: {
					pageContext: {
						urlPathname: path
					}
				}
			}
		})
	})
