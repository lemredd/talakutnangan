import { shallowMount } from "@vue/test-utils"

import PicturePicker from "./picture_picker.vue"

describe("Component: Picture Picker", () => {
	it("should give the proper input ID", () => {
		const title = "sample-title"
		const wrapper = shallowMount<any>(PicturePicker, {
			"props": {
				"picture": null,
				title
			}
		})

		const fileInput = wrapper.find(`#input-${title}`)

		expect(wrapper.html()).toContain(fileInput.html())
	})

	it("should determine if user has profile picture", () => {
		const title = "sample-title"
		const sampleURL = "/images/profile.png"
		const picture = {
			"data": {
				"fileContents": sampleURL
			}
		}
		const wrapper = shallowMount<any>(PicturePicker, {
			"props": {
				picture,
				title
			}
		})

		const pictureComponent = wrapper.findComponent({ "name": "Picture" })

		expect(pictureComponent).toBeTruthy()
	})
})
