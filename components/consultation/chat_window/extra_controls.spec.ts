import { shallowMount } from "@vue/test-utils"

import Component from "./extra_controls.vue"

describe("Component: chat_window/extra_controls", () => {
	it("should emit toggling of action taken", async() => {
		const wrapper = shallowMount(Component, {
			"global": {
				"stubs": {
					"Dropdown": false,
					"IconButton": false
				}
			},
			"props": {
				"consultationId": "1",
				"isConsultationFinishedOrCancelled": false,
				"isCurrentUserConsultant": true,
				"isHeaderControlDropdownShown": true
			}
		})

		const showActionTakenOverlayBtn = wrapper.find(".show-action-taken-overlay-btn")

		await showActionTakenOverlayBtn.trigger("click")

		const emissions = wrapper.emitted()
		expect(emissions).toHaveProperty("showActionTakenOverlay")
	})

	it("should lead to printable consultation form", () => {
		const id = "1"
		const wrapper = shallowMount(Component, {
			"global": {
				"stubs": {
					"Dropdown": false,
					"IconButton": false
				}
			},
			"props": {
				"consultationId": id,
				"isConsultationFinishedOrCancelled": false,
				"isCurrentUserConsultant": true,
				"isHeaderControlDropdownShown": true
			}
		})
		const printableFormLink = wrapper.find(".view-printable-form-link")
		expect(printableFormLink.attributes("href")).toEqual(`/consultation/form/${id}`)
	})
})
