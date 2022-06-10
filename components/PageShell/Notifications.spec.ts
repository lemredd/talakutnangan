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

	it("should view all notifications once footer is clicked", async () => {
		const notificationFooter = wrapper.find(".notification-footer a")
		expect(notificationFooter.attributes("href")).toBe("/notifications")
	})
})
