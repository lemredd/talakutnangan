import { shallowMount } from "@vue/test-utils"

import Component from "./profile_picture_item.vue"


describe("Component: consultation/list/profile_picture_item", () => {
	it("should show if user has profile picture", () => {
		const sampleURL = "/images/profile.png"
		const wrapper = shallowMount<any>(Component, {
			"props": {
				"activity": {
					"user": {
						"data": {
							"profilePicture": {
								"data": {
									"fileContents": sampleURL
								}
							}
						}
					}
				}
			}
		})

		const profilePicture = wrapper.find("img")

		expect(profilePicture.attributes("src")).toEqual(sampleURL)
	})

	it("should not show if user has profile picture", () => {
		const wrapper = shallowMount<any>(Component, {
			"props": {
				"activity": {
					"user": {
						"data": {}
					}
				}
			}
		})

		const image = wrapper.find("img")
		const source = image.attributes("src")

		expect(source).toBe("stub")
	})
})
