import { shallowMount } from "@vue/test-utils"

import Component from "./profile_picture.vue"

describe("Component: helpers/profile_picture", () => {
	it("should show if user has profile picture", () => {
		const sampleURL = "/images/profile.png"
		const profilePicture = {
			"data": {
				"fileContents": sampleURL
			}
		}

		const wrapper = shallowMount<any>(Component, {
			"global": {
				"provide": {
					"pageContext": {
						"pageProps": {
							"userProfile": {
								"data": {
									profilePicture
								}
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

	it("should not show if user has no profile picture", () => {
		const wrapper = shallowMount<any>(Component, {
			"global": {
				"provide": {
					"pageContext": {
						"pageProps": {
							"userProfile": {
								"data": {}
							}
						}
					}
				}
			}
		})

		const image = wrapper.find("img")
		const source = image.attributes("src")

		expect(source).toBe("stub")
	})
})
