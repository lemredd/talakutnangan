import { mount, VueWrapper } from "@vue/test-utils"
import Notifications from "./Notifications.vue"

let wrapper: VueWrapper

describe("Component: Page Shell/Notifications", () => {
	beforeAll(() => {
		wrapper = mount(Notifications)
	})

