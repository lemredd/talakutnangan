import { shallowMount } from "@vue/test-utils"

import convertTimeToMinutes from "$/time/convert_time_to_minutes"

import Component from "./schedule_picker_group.vue"

describe("Component: Schedule Picker Group", () => {
	it("should list all schedules existing in a day", () => {
		const wrapper = shallowMount<any>(Component, {
			"props": {
				"dayName": "monday",
				"schedules": [
					{
						"dayName": "monday",
						"id": "18",
						"scheduleEnd": convertTimeToMinutes("08:00"),
						"scheduleStart": convertTimeToMinutes("12:00"),
						"type": "employee_schedule"
					},
					{
						"dayName": "monday",
						"id": "19",
						"scheduleEnd": convertTimeToMinutes("13:00"),
						"scheduleStart": convertTimeToMinutes("17:00"),
						"type": "employee_schedule"
					}
				]
			}
		})

		const schedulePickers = wrapper.findAllComponents({ "name": "SchedulePicker" })
		expect(schedulePickers.length).toBe(3)
	})
})
