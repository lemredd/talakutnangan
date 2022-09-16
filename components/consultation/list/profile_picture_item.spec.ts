import { shallowMount } from "@vue/test-utils"

import Component from "./profile_picture_item.vue"

describe("Component: consultation/list/profile_picture_item", () => {
	it("should show if user has profile picture", () => {
		const wrapper = shallowMount<any>(Component, {
			"props": {
				"activity": {
					"user": {
						"data": {
							"profilePicture": {
								"data": {
									"fileContents": "/images/profile.png"
								}
							}
						}
					}
				}
			}
		})

		const profilePicture = wrapper.findComponent({ "name": "ProfilePicture" })

		expect(profilePicture.exists()).toBeTruthy()
	})
})
