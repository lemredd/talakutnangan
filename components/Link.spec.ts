import { mount, VueWrapper } from "@vue/test-utils"
import Link from "./Link.vue"
import { usePageContext } from "#/usePageContext"

let wrapper: VueWrapper

describe("Component: Link", () => {
	beforeAll(() => {
		wrapper = mount(Link, {
			global: {
				stubs: {
					pageContext: usePageContext()
				}
			}
		})
	})
