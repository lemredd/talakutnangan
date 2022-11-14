import { nextTick } from "vue"
import { shallowMount } from "@vue/test-utils"

import { DayValues } from "$/types/database"

import convertTimeToMinutes from "$/time/convert_time_to_minutes"

import Component from "./scheduler.vue"

describe("Component: consultation/helpers/scheduler", () => {
	it("can select within employee's schedules", async() => {
		const currentTime = new Date()
		const currentHour = 8
		currentTime.setHours(currentHour)

		const schedules = {
			"data": [
				{
					"dayName": DayValues[currentTime.getDay()],
					"id": "1",
					"scheduleEnd": convertTimeToMinutes("09:00"),
					"scheduleStart": convertTimeToMinutes("08:00"),
					"type": "employee_schedule"
				}
			],
			"meta": {
				"count": 1
			}
		} as any

		const wrapper = shallowMount(Component, {
			"props": {
				"chosenDay": "",
				"chosenTime": "",
				"consultantSchedules": schedules
			}
		})

		// Load selectable days and its options
		const castedWrapper = wrapper.vm as any
		castedWrapper.dateToday = currentTime

		const selectableDay = wrapper
		.find(".selectable-day")
		.findComponent({ "name": "SelectableOptionsField" })
		await selectableDay.vm.$emit("update:modelValue", currentTime.toJSON())
		await wrapper.setProps({
			"chosenDay": currentTime.toJSON()
		})
		const selectableTime = wrapper
		.find(".selectable-time")
		.findComponent({ "name": "SelectableOptionsField" })
		const chosenTime = convertTimeToMinutes("08:30")
		await selectableTime.vm.$emit("update:modelValue", chosenTime)

		// Customizable date
		const emitted = wrapper.emitted()
		expect(emitted).toHaveProperty("update:chosenDay.0.0", currentTime.toJSON())
		expect(emitted).toHaveProperty("update:chosenTime.0.0", chosenTime)
	})
})
