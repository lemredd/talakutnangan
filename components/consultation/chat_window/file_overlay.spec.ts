/* eslint-disable max-lines */

import { shallowMount } from "@vue/test-utils"
import consolaGlobalInstance from "consola"

import Component from "./file_overlay.vue"

describe("Component: chat_window/file_overlay", () => {
	it("should show file preview for images", async() => {
		const wrapper = shallowMount(Component, {
			"global": {
				"stubs": {
					"Overlay": false
				}
			},
			"props": {
				"isFileRepoOverlayShown": true,
				"mustShowPreview": false
			}
		})
		const pictureTab = wrapper.find(".picture-tab")
		await pictureTab.trigger("click")

		expect(wrapper.emitted()).toHaveProperty("switchTab")
	})

	it("should show close itself", async() => {
		const wrapper = shallowMount(Component, {
			"global": {
				"stubs": {
					"Overlay": false
				}
			},
			"props": {
				"isFileRepoOverlayShown": true,
				"mustShowPreview": false
			}
		})
		const closeBtn = wrapper.find(".close-btn")
		await closeBtn.trigger("click")

		expect(wrapper.emitted()).toHaveProperty("hideFileRepoOverlay")
	})
})
