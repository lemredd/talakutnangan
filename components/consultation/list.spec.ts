import { shallowMount } from "@vue/test-utils"

import Component from "./list.vue"

describe("Component: consultation/list", () => {
	it("should show multiple chats", () => {
		const wrapper = shallowMount<any>(Component, {
			"props": {
				"consultations": {
					"data": [
						{
							"id": "1",
							"reason": "Reason A"
						},
						{
							"id": "2",
							"reason": "Reason B"
						}
					]
				},
				"chatMessageActivities": {
					"data": []
				},
				"previewMessages": {
					"data": []
				}
			}
		})

		const titles = wrapper.findAll(".consultation-title")

		expect(titles[0].text()).toContain("Reason A")
		expect(titles[1].text()).toContain("Reason B")
	})
})
