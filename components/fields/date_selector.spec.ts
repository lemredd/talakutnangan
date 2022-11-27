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

	it("can limit by given max value", async() => {
		const rawDate = new Date("2022-10-10")
		const invalidDateString = "2022-10-18"
		const wrapper = shallowMount(Component, {
			"props": {
				"max": "2022-10-17",
				"modelValue": rawDate
			}
		})
		const selectedDate = wrapper.find("#selected-date")
		await selectedDate.setValue(invalidDateString)

		const emission = wrapper.emitted()
		expect(emission).not.toHaveProperty("update:modelValue")
	})

	it("can limit by given min value", async() => {
		const rawDate = new Date("2022-10-10")
		const invalidDateString = "2022-10-09"
		const wrapper = shallowMount(Component, {
			"props": {
				"min": "2022-10-10",
				"modelValue": rawDate
			}
		})
		const selectedDate = wrapper.find("#selected-date")
		await selectedDate.setValue(invalidDateString)

		const emission = wrapper.emitted()
		expect(emission).not.toHaveProperty("update:modelValue")
	})
})
