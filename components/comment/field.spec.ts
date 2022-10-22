import flushPromises from "flush-promises"
import { shallowMount } from "@vue/test-utils"

import Component from "./field.vue"

describe("Component: comment/field", () => {
	it("may submit independently", async() => {
		const content = "Hello world"
		const wrapper = shallowMount<any>(Component, {
			"props": {
				"modelValue": content
			}
		})

		const field = wrapper.findComponent({ "name": "TextualField" })
		await field.setValue(content)
		await field.vm.$emit("saveImplicitly")
		await flushPromises()

		const updates = wrapper.emitted("submitComment")
		expect(updates).toHaveLength(1)
		expect(updates).toHaveProperty("0.0", content)
	})

	it("may submit dependently", async() => {
		const parentCommentID = "3"
		const content = "Hello world"
		const parentComment = {
			"id": parentCommentID,
			"type": "comment"
		}

		const wrapper = shallowMount<any>(Component, {
			"props": {
				"modelValue": content,
				parentComment
			}
		})

		const field = wrapper.findComponent({ "name": "TextualField" })
		await field.setValue(content)
		await field.vm.$emit("saveImplicitly")
		await flushPromises()

		const updates = wrapper.emitted("submitComment")
		expect(updates).toHaveLength(1)
		expect(updates).toHaveProperty("0.0", content)
	})
})
