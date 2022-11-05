import { shallowMount } from "@vue/test-utils"
import Component from "./date_selector.vue"

describe("Component: fields/date_selector", () => {
	it("can show valid date", () => {
		const rawDate = new Date("2022-10-10")
		const wrapper = shallowMount(Component, {
			"props": {
				"modelValue": rawDate
			}
		})

		const update = wrapper.props("modelValue")
		expect(update).toBe(rawDate)
	})

	it("cannot show invalid date", () => {
		const rawDate = new Date("2022-10-10")
		const invalidDate = new Date("2022-20-20")
		const wrapper = shallowMount(Component, {
			"props": {
				"modelValue": rawDate
			}
		})

		const update = wrapper.props("modelValue")
		expect(update === invalidDate).toBeFalsy()
	})
})
