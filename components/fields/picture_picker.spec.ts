import { shallowMount } from "@vue/test-utils"

import PicturePicker from "./picture_picker.vue"

describe("Component: Picture Picker", () => {
	it("should give the proper input ID", () => {
		const resourceType = "profile-picture"
		const wrapper = shallowMount<any>(PicturePicker, {
			"props": {
				"picture": null,
				resourceType
			}
		})

		const fileInput = wrapper.find(`#input-${resourceType}`)

		expect(wrapper.html()).toContain(fileInput.html())
	})


	it("should determine if user has profile picture", () => {
		const resourceType = "profile-picture"
		const sampleURL = "/images/profile.png"
		const picture = {
			"data": {
				"fileContents": sampleURL
			}
		}
		const wrapper = shallowMount<any>(PicturePicker, {
			"props": {
				picture,
				resourceType
			}
		})

		const pictureComponent = wrapper.findComponent({ "name": "Picture" })

		expect(pictureComponent).toBeTruthy()
	})

	it("should emit event after uploading image", async() => {
		const resourceType = "profile-picture"
		const wrapper = shallowMount<any>(PicturePicker, {
			"props": {
				"picture": null,
				resourceType
			}
		})

		const fileInput = wrapper.find(`#input-${resourceType}`)

		await fileInput.setValue("")

		const [ [ pickedFileEmission ] ] = wrapper.emitted("submitFile") as any[][]
		expect(pickedFileEmission).toBeInstanceOf(FormData)
	})
})
