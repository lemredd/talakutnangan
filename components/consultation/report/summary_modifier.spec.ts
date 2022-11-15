import { shallowMount } from "@vue/test-utils"

import Component from "./summary_modifier.vue"

describe("Component: consultation/report/summary_modifier", () => {
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

		const picker = wrapper.findComponent({ "name": "DateRangePicker" })
		const newRangeBegin = new Date("2022-08-01T00:00:00")
		const newRangeEnd = new Date("2022-08-10T00:00:00")
		await picker.vm.$emit("update:rangeBegin", newRangeBegin)
		await picker.vm.$emit("update:rangeEnd", newRangeEnd)
		const form = wrapper.find("form")
		await form.trigger("submit")

		const emits = wrapper.emitted("renewSummary")
		expect(emits).toHaveProperty("0.0.rangeBegin", newRangeBegin)
		expect(emits).toHaveProperty("0.0.rangeEnd", newRangeEnd)
	})
})
