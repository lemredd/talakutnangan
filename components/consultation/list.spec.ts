import { shallowMount, flushPromises } from "@vue/test-utils"

import Stub from "$/singletons/stub"

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

	it("can visit chat by ID", async() => {
		const id = "2"

		const wrapper = shallowMount<any>(Component, {
			"props": {
				"chatMessageActivities": {
					"data": []
				},
				"consultations": {
					"data": [
						{
							"id": "1",
							"reason": "Reason A"
						},
						{
							id,
							"reason": "Reason B"
						}
					]
				},
				"previewMessages": {
					"data": []
				}
			}
		})
		const consultationListItem = wrapper.find(".consultation:nth-child(2)")

		await consultationListItem.trigger("click")
		await flushPromises()

		const previousCalls = Stub.consumePreviousCalls()
		expect(previousCalls).toHaveProperty("0.functionName", "assignPath")
		expect(previousCalls).toHaveProperty("0.arguments", [ `/consultation/${id}` ])
	})
})
