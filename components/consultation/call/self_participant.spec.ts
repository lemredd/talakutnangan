import { shallowMount } from "@vue/test-utils"

import Component from "./self_participant.vue"

describe("Component: consultation/call/self participant", () => {
		const mockGetUserMedia = jest.fn(
			() => new Promise<string>(
				resolve => {
					resolve("mock source")
				}
			)
		)

		Object.defineProperty(global.navigator, "mediaDevices", {
			"value": {
				"getUserMedia": mockGetUserMedia
			}
		})

	it("should identify uniquely", () => {
		const userProfile = {
			"data": {
				"id": "1",
				"name": "User A"
			}
		}
		const wrapper = shallowMount(Component, {
			"global": {
				"provide": {
					"pageContext": { "pageProps": {
						userProfile
					} }
				}
			},
			"props": {
				"mustShowVideo": false,
				"mustTransmitAudio": false
			}
		})

		const selfParticipant = wrapper.find(".self-participant")
		expect(selfParticipant.attributes("id"))
		.toEqual(`${userProfile.data.id}_${userProfile.data.name}`)
	})

	it.todo("can load audio track")

	it("can load video track", async() => {
		const userProfile = {
			"data": {
				"id": "1",
				"name": "User A"
			}
		}
		const wrapper = shallowMount(Component, {
			"global": {
				"provide": {
					"pageContext": { "pageProps": {
						userProfile
					} }
				}
			},
			"props": {
				"mustShowVideo": false,
				"mustTransmitAudio": false
			}
		})
		await wrapper.setProps({
			"mustShowVideo": true
		})

		const videoElement = wrapper.find("video")
		expect(videoElement.attributes("autoplay")).toBeDefined()
	})
})
