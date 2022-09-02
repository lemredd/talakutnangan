import { shallowMount } from "@vue/test-utils"
import type { DeserializedConsultationResource } from "$/types/documents/consultation"

import Component from "./user_controller.vue"

describe("Component: consultation/chat_window/user_controller", () => {
	it("should show main controllers if ongoing", () => {
		const wrapper = shallowMount<any>(Component, {
			"props": {
				"consultation": {
					"actionTaken": null,
					"deletedAt": null,
					"finishedAt": null,
					"id": "1",
					"reason": "",
					"scheduledStartAt": new Date(),
					"startedAt": new Date(),
					"type": "consultation"
				} as DeserializedConsultationResource
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

	it("should show start button if consultation will start", () => {
		const wrapper = shallowMount<any>(Component, {
			"props": {
				"consultation": {
					"actionTaken": null,
					"deletedAt": null,
					"finishedAt": null,
					"id": "1",
					"reason": "",
					"scheduledStartAt": new Date(),
					"startedAt": null,
					"type": "consultation"
				}
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

	it("should start upon pressing the button", async() => {
		const wrapper = shallowMount<any>(Component, {
			"props": {
				"consultation": {
					"actionTaken": null,
					"deletedAt": null,
					"finishedAt": null,
					"id": "1",
					"reason": "",
					"scheduledStartAt": new Date(),
					"startedAt": null,
					"type": "consultation"
				}
			}
		})

		const startButton = wrapper.find(".wide-control .start")
		await startButton.trigger("click")

		const events = wrapper.emitted("startConsultation")
		expect(events).toHaveLength(1)
	})
})
