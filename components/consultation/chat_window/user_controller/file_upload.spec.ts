import { nextTick, readonly, ref } from "vue"
import { flushPromises, shallowMount } from "@vue/test-utils"

import type { AttachedChatFileResource } from "$/types/documents/attached_chat_file"
import type {
	ChatMessageResource,
	ChatMessageRelationships,
	ChatMessageDocument
} from "$/types/documents/chat_message"

import { CHAT_MESSAGE_ACTIVITY } from "$@/constants/provided_keys"

import RequestEnvironment from "$/singletons/request_environment"

import Component from "./file_upload.vue"
import convertByteStringToBytes from "$/helpers/data/convert_byte_string_to_bytes"

describe("Component: User controller/File Upload", () => {
	describe("image upload", () => {
		const accept = "image/png"

		it("can preview uploaded file", async() => {
			const wrapper = shallowMount<any>(Component, {
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

		it("should have subkind as image", () => {
			const wrapper = shallowMount<any>(Component, {
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
			const castedWrapper = wrapper.vm as any
			const { subKind } = castedWrapper
			const subKindInput = wrapper.find(".sub-kind")

			expect(subKind).toEqual("image")
			expect(subKindInput.attributes("value")).toEqual("image")
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
			const wrapper = shallowMount<any>(Component, {
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

	describe("file upload", () => {
		const accept = "*/*"

		it("can preview uploaded file", async() => {
			const wrapper = shallowMount<any>(Component, {
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
			const previewFile = wrapper.find(".preview-file-container")
			expect(previewFile.exists()).toBeTruthy()
		})

		it("should have subkind as file", () => {
			const wrapper = shallowMount<any>(Component, {
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
			const castedWrapper = wrapper.vm as any
			const { subKind } = castedWrapper
			const subKindInput = wrapper.find(".sub-kind")

			expect(subKind).toEqual("file")
			expect(subKindInput.attributes("value")).toEqual("file")
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
								"name": "file.txt",
								"size": 10000,
								"type": "file/*"
							}
						]
					}
				}
			}
			const wrapper = shallowMount<any>(Component, {
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

		it("should show error if file size > 20MB", async() => {
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
						"item": (index: number) => {
							const storedFiles = [
								{
									"name": "file.txt",
									"size": convertByteStringToBytes("25MB"),
									"type": "file/*"
								}
							]

							return storedFiles[index]
						}
					}
				}
			}
			const wrapper = shallowMount<any>(Component, {
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

			const castedWrapper = wrapper.vm as any

			global.URL.createObjectURL = jest.fn()
			castedWrapper.extractFile(event)
			await nextTick()
			const sendBtn = wrapper.find(".send-btn")
			expect(castedWrapper.isFileSizeGreaterThanLimit).toBeTruthy()
			expect(sendBtn.attributes("disabled")).toBeDefined()

			const { receivedErrors } = castedWrapper
			expect(receivedErrors).not.toHaveLength(0)
		})

		it("can remove preview uploaded file", async() => {
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
						"item": (index: number) => {
							const storedFiles = [
								{
									"name": "file.txt",
									"size": convertByteStringToBytes("25MB"),
									"type": "file/*"
								}
							]

							return storedFiles[index]
						}
					}
				}
			}
			const wrapper = shallowMount<any>(Component, {
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

			// Access internals of component
			const castedWrapper = wrapper.vm as any

			// Imitate selecting of file
			global.URL.createObjectURL = jest.fn()
			castedWrapper.extractFile(event)
			await nextTick()
			const removeBtn = wrapper.find(".remove-file-btn")
			await removeBtn.trigger("click")

			const {
				filename,
				previewFile,
				fileSize,
				receivedErrors
			} = castedWrapper
			expect(filename).toEqual(null)
			expect(previewFile).toEqual(null)
			expect(fileSize).toEqual(null)
			expect(receivedErrors).toEqual([])
		})
	})
})
