import { shallowMount } from "@vue/test-utils"

import Component from "./empty_chat_window.vue"

describe("Component: consultation/empty_chat_window", () => {
	it("should show student content", () => {
		const wrapper = shallowMount<any>(Component, {
			"props": {
				"userProfile": {
					"data": {
						"kind": "student"
					}
				}
			}
		})

		const header = wrapper.find("h1.student")
		const content = wrapper.find("p.student")

		expect(header.exists()).toBeTruthy()
		expect(content.exists()).toBeTruthy()
	})

	it("should show reachable employee content", () => {
		const wrapper = shallowMount<any>(Component, {
			"props": {
				"userProfile": {
					"data": {
						"kind": "reachable_employee"
					}
				}
			}
		})

		const header = wrapper.find("h1.reachable_employee")
		const content = wrapper.find("p.reachable_employee")

		expect(header.exists()).toBeTruthy()
		expect(content.exists()).toBeTruthy()
	})
})
