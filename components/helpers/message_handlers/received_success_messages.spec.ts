import { shallowMount } from "@vue/test-utils"

import Component from "./received_success_messages.vue"

describe("Component: Helpers/received errors", () => {
	it("can list all received errors", () => {
		const receivedSuccessMessages = [
			"sample message 1",
			"sample message 2",
			"sample message 3"
		]
		const wrapper = shallowMount(Component, {
			"props": {
				receivedSuccessMessages
			}
		})

		const messageItems = wrapper.findAll("li")

		messageItems.forEach((item, index) => {
			expect(item.text()).not.toEqual("")
			expect(item.text()).toEqual(receivedSuccessMessages[index])
		})
	})
})
