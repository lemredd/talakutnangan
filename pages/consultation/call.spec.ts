import { mount } from "@vue/test-utils"

import Page from "./call.page.vue"

describe("Page: consultation/call", () => {
	it("should toggle track states", async() => {
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
		const wrapper = mount(Page, {
			"global": {
				"provide": {
					"pageContext": {
						"pageProps": {
							userProfile
						}
					}
				}
			}
		})
		const castedWrapper = wrapper.vm as any
		const toggleVideoBtn = wrapper.find(".toggle-video")
		const toggleMicBtn = wrapper.find(".toggle-mic")
		await toggleVideoBtn.trigger("click")
		await toggleMicBtn.trigger("click")

		const {
			mustShowVideo,
			mustTransmitAudio
		} = castedWrapper
		expect(mustShowVideo).toBeTruthy()
		expect(mustTransmitAudio).toBeTruthy()
	})
})
