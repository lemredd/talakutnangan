import { nextTick, readonly, ref } from "vue"
import { flushPromises, shallowMount } from "@vue/test-utils"

import type { AttachedChatFileResource } from "$/types/documents/attached_chat_file"
import type {
	ChatMessageResource,
	ChatMessageRelationships,
	ChatMessageDocument
} from "$/types/documents/chat_message"

import RequestEnvironment from "$/singletons/request_environment"

import Component from "./file_upload.vue"
import { CHAT_MESSAGE_ACTIVITY } from "$@/constants/provided_keys"

describe("Component: User controller/File Upload", () => {
	describe("image upload", () => {
		const accept = "image/png"
		it("can preview uploaded file", async() => {
			const wrapper = shallowMount(Component, {
				"global": {
					"provide": {
						[CHAT_MESSAGE_ACTIVITY]: readonly(ref({ "id": "1" }))
					},
					"stubs": {
						"Overlay": false
					}
				},
				"props": {
					accept,
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

		it("can send selected file", async() => {
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
					"provide": {
						[CHAT_MESSAGE_ACTIVITY]: readonly(ref({ "id": "1" }))
					},
					"stubs": {
						"Overlay": false
					}
				},
				"props": {
					accept,
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

			const castFetch = fetch as jest.Mock<any, any>
			const [ [ request ] ] = castFetch.mock.calls
			expect(request).toHaveProperty("method", "POST")
			expect(request).toHaveProperty("url", "/api/chat_message/create_with_file")
			expect(wrapper.emitted()).toHaveProperty("close")
		})
	})
})
