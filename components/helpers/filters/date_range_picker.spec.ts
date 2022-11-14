import { shallowMount } from "@vue/test-utils"

import Component from "./date_range_picker.vue"

describe("Component: helpers/filters/date_range_picker", () => {
	it("can select a semester", async() => {
		const semester = {
			"endAt": new Date("2022-10-10T00:00:00"),
			"id": "1",
			"name": "A",
			"startAt": new Date("2022-10-01T00:00:00")
		}
		const initialRangeBegin = new Date("2022-09-01T00:00:00")
		const initialRangeEnd = new Date("2022-09-10T00:00:00")
		const wrapper = shallowMount<any>(Component, {
			"props": {
				initialRangeBegin,
				initialRangeEnd,
				"semesters": {
					"data": [
						semester
					]
				}
			}
		})
		const options = wrapper.findComponent({ "name": "SelectableOptionsField" })
		await options.setValue(semester.id)

		const emits = wrapper.emitted()
		expect(emits).toHaveProperty("update:rangeBegin.0.0", semester.startAt)
		expect(emits).toHaveProperty("update:rangeEnd.0.0", semester.endAt)
	})

	it("can select a custom date", async() => {
		const semester = {
			"endAt": new Date("2022-10-10T00:00:00"),
			"id": "1",
			"name": "A",
			"startAt": new Date("2022-10-01T00:00:00")
		}
		const initialRangeBegin = new Date("2022-09-01T00:00:00")
		const initialRangeEnd = new Date("2022-09-10T00:00:00")
		const wrapper = shallowMount<any>(Component, {
			"props": {
				initialRangeBegin,
				initialRangeEnd,
				"semesters": {
					"data": [
						semester
					]
				}
			}
		})
		const options = wrapper.findComponent({ "name": "SelectableOptionsField" })
		await options.setValue("custom")
		const [
			rangeBeginSelector,
			rangeEndSelector
		] = wrapper.findAllComponents({ "name": "DateSelector" })
		const newRangeBegin = new Date("2022-08-01T00:00:00")
		const newRangeEnd = new Date("2022-08-10T00:00:00")
		await rangeBeginSelector.vm.$emit("update:modelValue", newRangeBegin)
		await rangeEndSelector.vm.$emit("update:modelValue", newRangeEnd)

		const emits = wrapper.emitted()
		expect(emits).toHaveProperty("update:rangeBegin.0.0", newRangeBegin)
		expect(emits).toHaveProperty("update:rangeEnd.0.0", newRangeEnd)
	})
})
