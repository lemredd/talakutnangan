import { shallowMount } from "@vue/test-utils"

import Component from "./last_chat.vue"

describe("Component: consultation/list/last_chat", () => {
	it("should show the only chat message", () => {
		const currentTime = new Date()
		const wrapper = shallowMount<any>(Component, {
			"props": {
				"lastChat": {
					"createdAt": currentTime,
					"data": {
						"value": "Hello world"
					}
				}
			}
		})

		const lastChatTime = wrapper.find(".last-chat-time-sent")

		expect(lastChatTime.text()).toBe(currentTime.toString())
	})
})
