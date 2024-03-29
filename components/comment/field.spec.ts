import flushPromises from "flush-promises"
import { shallowMount } from "@vue/test-utils"

import Component from "./field.vue"

describe("Component: comment/field", () => {
	it("may submit independently", async() => {
		const content = "Hello world"
		const user = {
			"data": {
				"id": "1",
				"type": "user"
			}
		}

		const wrapper = shallowMount<any>(Component, {
			"props": {
				"modelValue": content,
				"status": "unlocked",
				user
			}
		})

		const field = wrapper.findComponent({ "name": "TextualField" })
		await field.setValue(content)
		await field.vm.$emit("saveImplicitly")
		await flushPromises()

		const updates = wrapper.emitted("submitComment")
		expect(updates).toHaveLength(1)
		expect(updates).toHaveProperty("0")
	})
})
