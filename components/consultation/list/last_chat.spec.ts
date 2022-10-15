import { shallowMount } from "@vue/test-utils"

import Component from "./last_chat.vue"

describe("Component: consultation/list/last_chat", () => {
	describe("message kinds", () => {
		const user = {
			"data": {
				"name": "sample user"
			}
		}

		it("should preview attachements correctly", () => {
			const currentTime = new Date()
			const wrapper = shallowMount<any>(Component, {
				"props": {
					"lastChat": {
						"createdAt": currentTime,
						"data": {
							"value": ""
						},
						"kind": "file",
						user
					}
				}
			})
			const lastChat = wrapper.find(".last-chat")
			expect(lastChat.html()).toContain("sent an attachment")
		})

		it("should preview status correctly", () => {
			const currentTime = new Date()
			const wrapper = shallowMount<any>(Component, {
				"props": {
					"lastChat": {
						"createdAt": currentTime,
						"data": {
							"value": "has done something"
						},
						"kind": "status",
						user
					}
				}
			})
			const lastChat = wrapper.find(".last-chat")
			expect(lastChat.text()).toEqual(
				`${user.data.name} ${wrapper.props("lastChat").data.value}`
			)
		})

		it("should preview status correctly", () => {
			const currentTime = new Date()
			const wrapper = shallowMount<any>(Component, {
				"props": {
					"lastChat": {
						"createdAt": currentTime,
						"data": {
							"value": "has done something"
						},
						"kind": "text",
						user
					}
				}
			})
			const lastChat = wrapper.find(".last-chat")
			expect(lastChat.text()).toContain(":")
		})
	})

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
		const castedWrapper = wrapper.vm as any

		expect(lastChatTime.text()).toBe(castedWrapper.lastChatTimeSent)
	})
})
