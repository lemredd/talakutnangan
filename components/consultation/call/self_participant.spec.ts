import { shallowMount } from "@vue/test-utils"

import Component from "./self_participant.vue"

describe("Component: consultation/call/self participant", () => {
	it("should identify uniquely", () => {
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
			}
		})

		const selfParticipant = wrapper.find(".self-participant")
		expect(selfParticipant.attributes("id"))
		.toEqual(`${userProfile.data.id}_${userProfile.data.name}`)
	})

	it.todo("can load audio track")

	it.todo("can load video track")
})
