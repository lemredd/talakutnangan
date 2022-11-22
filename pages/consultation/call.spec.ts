import { flushPromises, mount } from "@vue/test-utils"

import RequestEnvironment from "$/singletons/request_environment"

import Page from "./call.page.vue"
import { nextTick } from "vue"
import Stub from "$/singletons/stub"

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
		fetchMock.mockResponseOnce(
			"",
			{ "status": RequestEnvironment.status.NO_CONTENT }
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

	it("can join with local tracks", async() => {
		fetchMock.mockResponseOnce(
			JSON.stringify({
				"meta": {
					"RTCToken": "RandomString"
				}
			}),
			{ "status": RequestEnvironment.status.OK }
		)
		fetchMock.mockResponseOnce(
			"",
			{ "status": RequestEnvironment.status.NO_CONTENT }
		)
		fetchMock.mockResponseOnce(
			"",
			{ "status": RequestEnvironment.status.NO_CONTENT }
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

		const castWrapper = wrapper.vm as any

		// Mock ready state of calling
		castWrapper.isReadyForCalling = true
		await nextTick()

		const joinCallBtn = wrapper.find(".join-call-btn")
		await joinCallBtn.trigger("click")

		const previousCalls = Stub.consumePreviousCalls()
		expect(previousCalls).toHaveProperty("0.functionName", "initiateVideoConferenceEngine")
		expect(previousCalls).toHaveProperty("1.functionName", "joinAndPresentLocalTracks")
	})
})
