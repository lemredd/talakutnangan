import { shallowMount } from "@vue/test-utils"
import { faker } from "@faker-js/faker"
import Component from "@/fields/non-sensitive_text.vue"

describe("Component: fields/non-sensitive_text", () => {
	it("can update", async() => {
		const wrapper = shallowMount(Component, {
			"props": {
				"label": "E-mail",
				"modelValue": "",
				"required": true,
				"type": "email"
			}
		})
		const field = wrapper.find("input")
		const exampleEmail = faker.internet.exampleEmail()

		await field.setValue(exampleEmail)

		const updates = wrapper.emitted("update:modelValue") as string[]
		expect(updates).toHaveLength(1)
		expect(updates[0]).toEqual([ exampleEmail ])
	})

	it("may be edited", async() => {
		const wrapper = shallowMount(Component, {
			"props": {
				"editable": true,
				"label": "E-mail",
				"modelValue": "",
				"required": true,
				"type": "email"
			}
		})

		const editButton = wrapper.find("button")
		const field = wrapper.find("input")

		await editButton.trigger("click")

		expect(field.attributes("disabled")).not.toBeTruthy()
	})

	it("may not be edited", () => {
		const wrapper = shallowMount(Component, {
			"props": {
				"editable": false,
				"label": "E-mail",
				"modelValue": "",
				"required": true,
				"type": "email"
			}
		})

		const editButton = wrapper.find("button")
		const field = wrapper.find("input")

		expect(editButton.exists()).toBeFalsy()
		expect(field.attributes("disabled")).toBeFalsy()
	})
})
