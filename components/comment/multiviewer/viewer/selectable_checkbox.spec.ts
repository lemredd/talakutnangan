import { shallowMount } from "@vue/test-utils"

import Component from "./selectable_checkbox.vue"

describe("Component: comment/multiviewer/viewer/checkbox", () => {
	it("can downvote", async() => {
		const modelValue = "upvote"
		const wrapper = shallowMount<any>(Component, {
			"global": {
				"stubs": {
					"Suspensible": false
				}
			},
			"props": {
				"isLoaded": true,
				modelValue,
				"title": "View"
			}
		})

		const field = wrapper.find("label:nth-child(2) input")
		await field.setValue(true)

		const updates = wrapper.emitted("update:modelValue") as string[][]
		expect(updates).toHaveLength(1)
		expect(updates[0][0]).toBe("downvote")
	})

	it("can abstain", async() => {
		const modelValue = "downvote"
		const wrapper = shallowMount<any>(Component, {
			"global": {
				"stubs": {
					"Suspensible": false
				}
			},
			"props": {
				"isLoaded": true,
				modelValue,
				"title": "View"
			}
		})

		const field = wrapper.find("label:nth-child(2) input")
		await field.setValue(false)

		const updates = wrapper.emitted("update:modelValue") as string[][]
		expect(updates).toHaveLength(1)
		expect(updates[0][0]).toBe("abstain")
	})
})
