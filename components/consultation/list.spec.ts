import { shallowMount, flushPromises } from "@vue/test-utils"

import { BODY_CLASSES } from "$@/constants/provided_keys"

import Stub from "$/singletons/stub"
import specializePath from "$/helpers/specialize_path"

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

		// ! might be bug from vue/test-utils. nth-of-type should be 2
		const consultationListItem = wrapper.find(".consultation:nth-of-type(3)")

		await consultationListItem.trigger("click")
		await flushPromises()

		const previousCalls = Stub.consumePreviousCalls()
		expect(previousCalls).toHaveProperty("0.functionName", "assignPath")
		expect(previousCalls).toHaveProperty("0.arguments", [
			specializePath("/consultation/read/:id", {
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

	it.skip("toggle search button", async() => {
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

		const searchBtn = wrapper.find(".search-btn")
		expect(searchBtn.exists()).toBeTruthy()

		await searchBtn.trigger("click")
		const closeSearchBtn = wrapper.find(".close-search-btn")
		expect(closeSearchBtn.exists()).toBeTruthy()

		// TODO(lead): ensure searching functionality
	})
})
