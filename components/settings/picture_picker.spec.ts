import { mount } from "@vue/test-utils"

import PicturePicker from "@/settings/picture_picker.vue"

describe("Component: Picture Picker", () => {
	it("should give the proper input ID", () => {
		const title = "Sample Title"
		const wrapper = mount(PicturePicker, {
			props: {
				title,
				picture: null
			}
		})

		console.log(wrapper.html())
	})
})
