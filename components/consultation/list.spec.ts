import { shallowMount, flushPromises } from "@vue/test-utils"

import Stub from "$/singletons/stub"

import Component from "./list.vue"

describe("Component: consultation/list", () => {
	it("should show multiple chats", () => {
		const wrapper = shallowMount<any>(Component, {
			"global": {
				"provide": {
					"pageContext": { "urlPathname": "/" }
				}
			},
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
			"global": {
				"provide": {
					"pageContext": { "urlPathname": "/" }
				}
			},
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

	it("should display non-duplicating profile pictures", () => {
		const wrapper = shallowMount<any>(Component, {
			"global": {
				"provide": {
					"pageContext": { "urlPathname": "/" }
				}
			},
			"props": {
				"chatMessageActivities": {
					"data": [
						{
							"consultation": { "data": { "id": "1" } },
							"id": "1",
							"user": {
								"data": {
									"id": "1",
									"name": "participant"
								}
							}
						},
						{
							"consultation": { "data": { "id": "1" } },
							"id": "2",
							"user": {
								"data": {
									"id": "2",
									"name": "participant"
								}
							}
						},
						{
							"consultation": { "data": { "id": "1" } },
							"id": "3",
							"user": {
								"data": {
									"id": "2",
									"name": "participant"
								}
							}
						}
					]
				},
				"consultations": {
					"data": [
						{
							"id": "1",
							"reason": "Reason A"
						}
					]
				},
				"previewMessages": {
					"data": []
				}
			}
		})

		const profilePictures = wrapper.findAllComponents(".profile-picture-item")
		const lengthOfUniqueUsers = wrapper.props("chatMessageActivities").data.length - 1
		expect(profilePictures).toHaveLength(lengthOfUniqueUsers)
	})
})
