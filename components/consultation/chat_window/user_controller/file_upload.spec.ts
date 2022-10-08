import RequestEnvironment from "$/singletons/request_environment"
import { shallowMount } from "@vue/test-utils"

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
	it("can send selected file", () => {
		fetchMock.mockResponseOnce(JSON.stringify({

		}), {
			"status": RequestEnvironment.status.CREATED
		})
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
	})
})
