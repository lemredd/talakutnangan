import { shallowMount } from "@vue/test-utils"

import Component from "./profile_picture.vue"

describe("Component: helpers/profile_picture_item", () => {
	it("should show if user has profile picture", () => {
		const sampleURL = "/images/profile.png"
		const wrapper = shallowMount<any>(Component, {
			"props": {
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
		})

		const image = wrapper.find("img")
		const source = image.attributes("src")

		expect(source).toBe(sampleURL)
	})

	it("should show if user has profile picture", () => {
		const wrapper = shallowMount<any>(Component, {
			"props": {
				"user": {
					"data": {}
				}
			}
		})

		const image = wrapper.find("img")
		const source = image.attributes("src")

		expect(source).toBe("stub")
	})
})
