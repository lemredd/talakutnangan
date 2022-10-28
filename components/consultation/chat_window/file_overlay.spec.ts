/* eslint-disable max-lines */
import { nextTick } from "vue"
import { shallowMount } from "@vue/test-utils"

import { DeserializedChatMessageListDocument } from "$/types/documents/chat_message"

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
				"generalFiles": { "data": [] },
				"imageFiles": { "data": [] },
				"isFileRepoOverlayShown": true,
				"mustShowPreview": false
			}
		})
		const pictureTab = wrapper.find(".picture-tab")
		await pictureTab.trigger("click")

		expect(wrapper.emitted()).toHaveProperty("switchTab")
	})

	it("should close itself", async() => {
		const wrapper = shallowMount(Component, {
			"global": {
				"stubs": {
					"Overlay": false
				}
			},
			"props": {
				"generalFiles": { "data": [] },
				"imageFiles": { "data": [] },
				"isFileRepoOverlayShown": true,
				"mustShowPreview": false
			}
		})
		const closeBtn = wrapper.find(".close-btn")
		await closeBtn.trigger("click")

		expect(wrapper.emitted()).toHaveProperty("hideFileRepoOverlay")
	})

	describe("image previewing", () => {
		it("can select file to preview", async() => {
			const firstImageFileContents = "first/image/file/contents"
			const secondImageFileContents = "second/image/file/contents"
			const imageFiles = {
				"data": [
					{
						"attachedChatFile": {
							"data": {
								"fileContents": firstImageFileContents
							}
						},
						"data": {
							"name": "Image 1.jpg",
							"subkind": "image"
						},
						"id": "1"
					},
					{
						"attachedChatFile": {
							"data": {
								"fileContents": secondImageFileContents
							}
						},
						"data": {
							"name": "Image 2.jpg",
							"subkind": "image"
						},
						"id": "2"
					}
				]
			} as unknown as DeserializedChatMessageListDocument
			const wrapper = shallowMount(Component, {
				"global": {
					"stubs": {
						"Overlay": false
					}
				},
				"props": {
					"generalFiles": { "data": [] },
					imageFiles,
					"isFileRepoOverlayShown": true,
					"mustShowPreview": true
				}
			})
			const imageFileItems = wrapper.findAll(".file-item")
			const [ firstImageFile, secondImageFile ] = imageFileItems
			const imageToPreview = wrapper.find(".image-to-preview")

			await firstImageFile.trigger("click")
			await nextTick()
			expect(imageToPreview.attributes("src")).toEqual(firstImageFileContents)
			await secondImageFile.trigger("click")
			await nextTick()
			expect(imageToPreview.attributes("src")).toEqual(secondImageFileContents)
		})
	})
})
