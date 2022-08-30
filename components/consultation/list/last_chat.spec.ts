import { shallowMount } from "@vue/test-utils"

import Component from "./last_chat.vue"

describe("Component: consultation/list/last_chat", () => {
	it("should show the only chat message", () => {
		const currentTime = new Date()
		const wrapper = shallowMount<any>(Component, {
			"props": {
				"chats": {
					"data": [
						{
							"createdAt": currentTime,
							"data": {
								"value": "Hello world"
							}
						}
					]
				}
			}
		})

		const lastChatTime = wrapper.find(".last-chat-time-sent")

		expect(lastChatTime.text()).toBe(currentTime.toString())
	})

	it("should show last chat message from multiple messages", () => {
		const currentTime = new Date()
		const lastTime = new Date()
		lastTime.setSeconds(lastTime.getSeconds() - 5)
		const wrapper = shallowMount<any>(Component, {
			"props": {
				"chats": {
					"data": [
						{
							"createdAt": lastTime,
							"data": {
								"value": "Foo bar"
							}
						},
						{
							"createdAt": currentTime,
							"data": {
								"value": "Hello world"
							}
						}
					]
				}
			}
		})

		const lastChatTime = wrapper.find(".last-chat-time-sent")

		expect(lastChatTime.text()).toBe(currentTime.toString())
	})
})
