import { shallowMount } from "@vue/test-utils"
import { StatusValues } from "$/types/database"

import Component from "./user_controller.vue"

describe("Component: consultation/chat_window/user_controller", () => {
	it("should show main controllers if ongoing", async() => {
		const wrapper = shallowMount(Component, {
			"props": {
				"status": StatusValues[1]
			}
		})

		const wideControl = wrapper.find(".wide-control")
		const leftControls = wrapper.find(".left-controls")
		const messageBox = wrapper.find(".message-box")
		const rightControls = wrapper.find(".right-controls")

		expect(wideControl.exists()).toBeFalsy()
		expect(leftControls.exists()).toBeTruthy()
		expect(messageBox.exists()).toBeTruthy()
		expect(rightControls.exists()).toBeTruthy()
	})

	it("should show start button if consultation will start", async() => {
		const wrapper = shallowMount(Component, {
			"props": {
				"status": StatusValues[0]
			}
		})

		const wideControl = wrapper.find(".wide-control")
		const leftControls = wrapper.find(".left-controls")
		const messageBox = wrapper.find(".message-box")
		const rightControls = wrapper.find(".right-controls")

		expect(wideControl.exists()).toBeTruthy()
		expect(leftControls.exists()).toBeFalsy()
		expect(messageBox.exists()).toBeFalsy()
		expect(rightControls.exists()).toBeFalsy()
	})
})
