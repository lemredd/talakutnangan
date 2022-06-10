import { mount, VueWrapper } from "@vue/test-utils"
import Notifications from "./Notifications.vue"

let wrapper: VueWrapper

describe("Component: Page Shell/Notifications", () => {
	beforeAll(() => {
		wrapper = mount(Notifications)
	})

	it("should show notification lists on click", async () => {
		const button = wrapper.find("a#notification-btn")

		await button.trigger("click")
		const emissions = wrapper.emitted()

		expect(emissions).toHaveProperty("toggleNotificationList")
		expect(emissions.toggleNotificationList).toBeTruthy()
	})
