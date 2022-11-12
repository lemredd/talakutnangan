import { shallowMount, flushPromises } from "@vue/test-utils"

import { BODY_CLASSES } from "$@/constants/provided_keys"
import { READ_CONSULTATION } from "$/constants/template_page_paths"

import Stub from "$/singletons/stub"
import specializePath from "$/helpers/specialize_path"

import Component from "./item.vue"

describe("Component: consultation/list/item", () => {
	it("can visit chat by ID", async() => {
		const id = "2"

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
				"consultation": {
					id,
					"reason": "Reason A"
				},
				"previewMessages": {
					"data": []
				}
			}
		})

		const consultationListItem = wrapper.find(".consultation")

		await consultationListItem.trigger("click")
		await flushPromises()

		const previousCalls = Stub.consumePreviousCalls()
		expect(previousCalls).toHaveProperty("0.functionName", "assignPath")
		expect(previousCalls).toHaveProperty("0.arguments", [
			specializePath(READ_CONSULTATION, {
				id
			})
		])
	})

	it("should display non-duplicating profile pictures", () => {
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
				"consultation": {
					"id": "1",
					"reason": "Reason A"
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
