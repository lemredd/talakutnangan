import { shallowMount } from "@vue/test-utils"

import Component from "./call_controls.vue"

describe("Component: call/call controls", () => {
	it("must be able to join call", async() => {
		const wrapper = shallowMount(Component, {
			"props": {
				"isJoined": false,
				"isShowingVideo": true,
				"isTransmittingAudio": true
			}
		})
		const joinCallBtn = wrapper.find(".join-call-btn")
		await joinCallBtn.trigger("click")

		expect(wrapper.emitted()).toHaveProperty("joinCall")
	})

	it("can emit custom events", async() => {
		const wrapper = shallowMount(Component, {
			"props": {
				"isJoined": true,
				"isShowingVideo": true,
				"isTransmittingAudio": true
			}
		})
		const toggleVideoBtn = wrapper.findComponent(".toggle-video")
		const toggleMicBtn = wrapper.findComponent(".toggle-mic")
		const leaveCallBtn = wrapper.findComponent(".leave-call")

		await toggleVideoBtn.trigger("click")
		expect(wrapper.emitted()).toHaveProperty("toggleVideo")
		await toggleMicBtn.trigger("click")
		expect(wrapper.emitted()).toHaveProperty("toggleMic")
		await leaveCallBtn.trigger("click")
		expect(wrapper.emitted()).toHaveProperty("leaveCall")
	})
})
