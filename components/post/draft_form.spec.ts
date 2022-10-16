import { faker } from "@faker-js/faker"
import { shallowMount } from "@vue/test-utils"

import Component from "./draft_form.vue"

describe("Component: fields/non-sensitive_text", () => {
	it("can update", async() => {
		const wrapper = shallowMount(Component, {
			"props": {
				"modelValue": ""
			}
		})
		const field = wrapper.find("textarea")
		const exampleContent = faker.lorem.paragraphs(2)

		await field.setValue(exampleContent)

		const updates = wrapper.emitted("update:modelValue") as string[]
		expect(updates).toHaveLength(1)
		expect(updates[0]).toEqual([ exampleContent ])
	})
})
