import { shallowMount } from "@vue/test-utils"
import { faker } from "@faker-js/faker"
import Component from "./non-sensitive_text.vue"

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

	it("should change upon prop update", async() => {
		const wrapper = shallowMount<any>(Component, {
			"props": {
				"label": "E-mail",
				"modelValue": "",
				"type": "email"
			}
		})

		const newValue = "admin@example.com"
		await wrapper.setProps({
			"label": "E-mail",
			"modelValue": newValue,
			"type": "email"
		})

		const field = wrapper.find("input").element as HTMLInputElement
		expect(field.value).toBe(newValue)
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

	it("may be saved", async() => {
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

		await editButton.trigger("click")
		await editButton.trigger("click")

		const field = wrapper.find("input")
		expect(field.attributes("disabled")).toEqual("")
		expect(wrapper.emitted("save")).toHaveLength(1)
	})
})
