import { nextTick } from "vue"
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
				"containerId": "something",
				"isJoined": false,
				"isShowingVideo": true,
				"isTransmittingAudio": false
			}
		})

		const selfParticipant = wrapper.find(".self-participant")
		expect(selfParticipant.attributes("id"))
		.toEqual(`${userProfile.data.id}_${userProfile.data.name}`)
	})

	it("can preview video", async() => {
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
				"containerId": "something",
				"isJoined": false,
				"isShowingVideo": true,
				"isTransmittingAudio": false
			}
		})
		const castWrapper = wrapper.vm as any
		const previewVideo = wrapper.find(".preview-video")
		await nextTick()

		expect(castWrapper.previewVideo).toHaveProperty("srcObject", "mock source")
		expect(previewVideo.attributes("autoplay")).toBeDefined()
	})
})
