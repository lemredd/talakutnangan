import { nextTick } from "vue"
import { flushPromises, shallowMount } from "@vue/test-utils"

import type { AttachedChatFileResource } from "$/types/documents/attached_chat_file"
import type {
	ChatMessageResource,
	ChatMessageRelationships,
	ChatMessageDocument
} from "$/types/documents/chat_message"

import RequestEnvironment from "$/singletons/request_environment"

import Component from "./file_upload.vue"

describe("Component: User controlller/File Upload", () => {
	it("can preview uploaded file", async() => {
		const wrapper = shallowMount(Component, {
			"global": {
				"stubs": {
					"Overlay": false
				}
			},
			"props": {
				"isShown": true
			}
		})
		const fileInput = wrapper.find("input[type=file]")

		await fileInput.setValue("")
		const previewFile = wrapper.find(".preview-file")
		const previewImg = previewFile.find("img")
		expect(previewFile.exists()).toBeTruthy()
		expect(previewImg.attributes("src")).toBeDefined()
	})

	it.only("can send selected file", async() => {
		const fileContents = "http://localhost:16000/api/attached_chat_file/1"
		fetchMock.mockResponseOnce(
			JSON.stringify({
				"data": {
					"attributes": {
						"kind": "file"
					},
					"id": "1",
					"relationships": {
						"attachedChatFile": {
							"data": {
								"id": "1",
								"type": "attached_chat_file"
							}
						}
					},
					"type": "chat_message"
				} as ChatMessageResource<"read"> & ChatMessageRelationships<"read">,
				"included": [
					{
						"attributes": {
							fileContents
						},
						"id": "1",
						"type": "attached_chat_file"
					} as AttachedChatFileResource
				]
			} as ChatMessageDocument<"read">),
			{ "status": RequestEnvironment.status.OK }
		)

		const event = {
			"target": {
				"files": {
					"item": () => [
						{
							"name": "image.png",
							"size": 10000,
							"type": "image/png"
						}
					]
				}
			}
		}
		const wrapper = shallowMount(Component, {
			"global": {
				"stubs": {
					"Overlay": false
				}
			},
			"props": {
				"isShown": true
			}
		})
		// ! find proper type
		const wrapperVM = wrapper.vm as any

		const disabledSendBtn = wrapper.find(".send-btn")
		expect(disabledSendBtn.attributes("disabled")).toBeDefined()

		global.URL.createObjectURL = jest.fn()
		wrapperVM.extractFile(event)
		const sendBtn = wrapper.find(".send-btn")
		await nextTick()
		expect(sendBtn.attributes("src")).toBeUndefined()

		await sendBtn.trigger("click")
		await flushPromises()

		expect(wrapper.emitted()).toHaveProperty("close")
	})
})
