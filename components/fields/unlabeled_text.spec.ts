import { faker } from "@faker-js/faker"
import { shallowMount } from "@vue/test-utils"
import Component from "./unlabeled_text.vue"

describe("Component: fields/unlabeled_text", () => {
	it("can update", async() => {
		const wrapper = shallowMount(Component, {
			"props": {
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
				"modelValue": "",
				"type": "email"
			}
		})

		const newValue = "admin@example.com"
		await wrapper.setProps({
			"modelValue": newValue,
			"type": "email"
		})

		const field = wrapper.find("input").element as HTMLInputElement
		expect(field.value).toBe(newValue)
	})

	it("may be edited", async() => {
		const wrapper = shallowMount(Component, {
			"props": {
				"modelValue": "",
				"required": true,
				"status": "locked",
				"type": "email"
			}
		})

		const editButton = wrapper.find(".edit-button")

		await editButton.trigger("click")

		const field = wrapper.find("input")
		expect(field.attributes("disabled")).toBe("")
		const updates = wrapper.emitted("update:status")
		expect(updates).toHaveLength(1)
		expect(updates).toHaveProperty("0.0", "unlocked")
	})

	it("may not be edited", async() => {
		const wrapper = shallowMount(Component, {
			"props": {
				"modelValue": "",
				"required": true,
				"status": "unlocked",
				"type": "email"
			}
		})

		const saveButton = wrapper.find(".save-button")

		await saveButton.trigger("click")

		const field = wrapper.find("input")
		expect(field.attributes("disabled")).toBeUndefined()
		const updates = wrapper.emitted("update:status")
		expect(updates).toHaveLength(1)
		expect(updates).toHaveProperty("0.0", "locked")
		expect(wrapper.emitted("save")).toHaveLength(1)
	})

	it("may be prepared", async() => {
		const wrapper = shallowMount(Component, {
			"props": {
				"modelValue": "",
				"required": true,
				"status": "loaded",
				"type": "email"
			}
		})

		const editButton = wrapper.find(".edit-button")

		await editButton.trigger("click")

		const field = wrapper.find("input")
		expect(field.attributes("disabled")).toBe("")
		const updates = wrapper.emitted("update:status")
		expect(updates).toHaveLength(1)
		expect(updates).toHaveProperty("0.0", "prepared")
	})

	it("may be processed", async() => {
		const wrapper = shallowMount(Component, {
			"props": {
				"modelValue": "",
				"required": true,
				"status": "prepared",
				"type": "email"
			}
		})

		const saveButton = wrapper.find(".save-button")

		await saveButton.trigger("click")

		const field = wrapper.find("input")
		expect(field.attributes("disabled")).toBeUndefined()
		const updates = wrapper.emitted("update:status")
		expect(updates).toHaveLength(1)
		expect(updates).toHaveProperty("0.0", "processing")
		expect(wrapper.emitted("save")).toHaveLength(1)
	})

	it("may not be processed", async() => {
		const wrapper = shallowMount(Component, {
			"props": {
				"modelValue": "",
				"required": true,
				"status": "prepared",
				"type": "email"
			}
		})

		const cancelButton = wrapper.find(".cancel-button")

		await cancelButton.trigger("click")

		const field = wrapper.find("input")
		expect(field.attributes("disabled")).toBeUndefined()
		const updates = wrapper.emitted("update:status")
		expect(updates).toHaveLength(1)
		expect(updates).toHaveProperty("0.0", "loaded")
	})

	it("must be disabled", async() => {
		const wrapper = shallowMount(Component, {
			"props": {
				"modelValue": "",
				"required": true,
				"status": "disabled",
				"type": "email"
			}
		})

		const field = wrapper.find("input")
		const editButton = wrapper.find(".edit-button")
		const doesExists = await editButton.exists()

		expect(field.attributes("disabled")).toBe("")
		expect(doesExists).toBeFalsy()
	})

	it("must be enabled", async() => {
		const wrapper = shallowMount(Component, {
			"props": {
				"modelValue": "",
				"required": true,
				"status": "enabled",
				"type": "email"
			}
		})

		const field = wrapper.find("input")
		const editButton = wrapper.find(".edit-button")
		const doesExists = await editButton.exists()

		expect(field.attributes("disabled")).toBeFalsy()
		expect(doesExists).toBeFalsy()
	})

	it("may be saved implicitly", async() => {
		const wrapper = shallowMount(Component, {
			"props": {
				"maySaveImplicitly": true,
				"modelValue": "",
				"required": true,
				"type": "email"
			}
		})

		const field = wrapper.find("input")
		await field.trigger("keyup.enter")

		expect(wrapper.emitted("saveImplicitly")).toHaveLength(1)
	})

	it("may not be saved implicitly", async() => {
		const wrapper = shallowMount(Component, {
			"props": {
				"modelValue": "",
				"required": true,
				"type": "email"
			}
		})

		const field = wrapper.find("input")
		await field.trigger("keyup.enter")

		expect(wrapper.emitted("saveImplicitly")).not.toBeDefined()
	})
})
