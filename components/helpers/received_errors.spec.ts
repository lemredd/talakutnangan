import { shallowMount } from "@vue/test-utils"

import Component from "./received_errors.vue"

describe("Component: Helpers/received errors", () => {
	it("can list all received errors", () => {
		const receivedErrors = [
			"sample error 1",
			"sample error 2",
			"sample error 3"
		]
		const wrapper = shallowMount(Component, {
			"props": {
				receivedErrors
			}
		})

		const errorItems = wrapper.findAll("li")

		errorItems.forEach((item, index) => {
			expect(item.text()).not.toEqual("")
			expect(item.text()).toEqual(receivedErrors[index])
		})
	})
})
