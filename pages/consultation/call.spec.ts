import { flushPromises, mount } from "@vue/test-utils"

import RequestEnvironment from "$/singletons/request_environment"

import Page from "./call.page.vue"

describe("Page: consultation/call", () => {
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

	it("can fetch generated token", async() => {
		const sampleToken = "ABcdE12345"
		fetchMock.mockResponseOnce(
			JSON.stringify({
				"meta": {
					"RTCToken": sampleToken
				}
			}),
			{ "status": RequestEnvironment.status.OK }
		)

		const userProfile = {
			"data": {
				"id": "1",
				"name": "User A"
			}
		}
		const consultation = {
			"data": {
				"id": "1"
			}
		}
		const chatMessageActivities = {
			"data": [
				{
					consultation,
					"user": userProfile
				}
			]
		}
		const wrapper = mount(Page, {
			"global": {
				"provide": {
					"pageContext": {
						"pageProps": {
							chatMessageActivities,
							consultation,
							userProfile
						}
					}
				}
			}
		})
		const castedWrapper = wrapper.vm as any
		await flushPromises()

		expect(castedWrapper.token).toEqual(sampleToken)
	})

	it.skip("can join with local tracks", async() => {
		fetchMock.mockResponseOnce(
			JSON.stringify({
				"meta": {}
			}),
			{ "status": RequestEnvironment.status.OK }
		)
		const userProfile = {
			"data": {
				"id": "1",
				"name": "User A"
			}
		}
		const consultation = {
			"data": {
				"id": "1"
			}
		}
		const chatMessageActivities = {
			"data": [
				{
					consultation,
					"user": userProfile
				}
			]
		}
		const wrapper = mount(Page, {
			"global": {
				"provide": {
					"pageContext": {
						"pageProps": {
							chatMessageActivities,
							consultation,
							userProfile
						}
					}
				}
			}
		})
		const castedWrapper = wrapper.vm as any
		const joinCallBtn = wrapper.find(".join-call-btn")
		const toggleVideoBtn = wrapper.find(".toggle-video")
		const toggleMicBtn = wrapper.find(".toggle-mic")
		await joinCallBtn.trigger("click")
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
