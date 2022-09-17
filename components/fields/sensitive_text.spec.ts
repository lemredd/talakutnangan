import { shallowMount } from "@vue/test-utils"
import Component from "@/fields/sensitive_text.vue"

describe("Component: fields/sensitive_text", () => {
	it("should verify user password", async() => {
		const wrapper = shallowMount(Component, {
			"props": {
				"friendlyFieldName": "password",
				"label": "Password",
				"modelValue": "",
				"required": true
			}
		})

		const editButton = wrapper.find("button")
		await editButton.trigger("click")
		const overlay = wrapper.find("overlay-stub")
		expect(overlay.html()).toBeTruthy()
	})
})
