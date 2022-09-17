import { shallowMount } from "@vue/test-utils"
import Component from "./change_password_field.vue"

describe("Component: settings/change_password_field", () => {
	it("should verify user password", async() => {
		const OLD_PASSWORD = "Hello"
		const NEW_PASSWORD = "World"
		const CONFIRM_NEW_PASSWORD = "!"
		const wrapper = shallowMount(Component, {
			"global": {
				"stubs": {
					"Overlay": false,
					"SensitiveTextField": false
				}
			},
			"props": {
				"confirmNewPassword": "",
				"newPassword": "",
				"oldPassword": ""
			}
		})
		const editButton = wrapper.find(".input-and-controls button")
		const oldInput = wrapper.find("input:nth-child(1)")
		const newInput = wrapper.find("input:nth-child(2)")
		const confirmationInput = wrapper.find("input:nth-child(3)")

		await editButton.trigger("click")
		await oldInput.setValue(OLD_PASSWORD)
		await newInput.setValue(NEW_PASSWORD)
		await confirmationInput.setValue(CONFIRM_NEW_PASSWORD)

		const updates = wrapper.emitted()
		expect(updates).toHaveProperty("update:oldPassword.0", [ OLD_PASSWORD ])
		expect(updates).toHaveProperty("update:newPassword.0", [ NEW_PASSWORD ])
		expect(updates).toHaveProperty("update:confirmNewPassword.0", [ CONFIRM_NEW_PASSWORD ])
	})

	it("can save user password", async() => {
		const wrapper = shallowMount(Component, {
			"global": {
				"stubs": {
					"Overlay": false,
					"SensitiveTextField": false
				}
			},
			"props": {
				"confirmNewPassword": "",
				"newPassword": "",
				"oldPassword": ""
			}
		})
		const editButton = wrapper.find(".input-and-controls button")
		const saveButton = wrapper.find(".overlay-footer button")

		await editButton.trigger("click")
		await saveButton.trigger("click")

		const updates = wrapper.emitted()
		expect(updates).toHaveProperty("savePassword")
	})
})
