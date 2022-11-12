import { shallowMount } from "@vue/test-utils"

import { BODY_CLASSES } from "$@/constants/provided_keys"

import Component from "./list.vue"

describe("Component: consultation/list", () => {
	it("should be able to add consultation for student", () => {
		const wrapper = shallowMount<any>(Component, {
			"global": {
				"provide": {
					[BODY_CLASSES]: [],
					"pageContext": {
						"pageProps": {
							"userProfile": {
								"data": {
									"kind": "student"
								}
							}
						},
						"urlPathname": "/"
					}
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
							"id": "2",
							"reason": "Reason B"
						}
					]
				},
				"previewMessages": {
					"data": []
				}
			}
		})

		const addConsultationButton = wrapper.find(".add-btn")
		expect(addConsultationButton.exists()).toBeTruthy()
	})

	it("should show multiple chats", () => {
		const wrapper = shallowMount<any>(Component, {
			"global": {
				"provide": {
					[BODY_CLASSES]: [],
					"pageContext": {
						"pageProps": {
							"userProfile": {
								"data": {
									"kind": "student"
								}
							}
						},
						"urlPathname": "/"
					}
				},
				"stubs": {
					"Item": false
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
							"id": "2",
							"reason": "Reason B"
						}
					]
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
