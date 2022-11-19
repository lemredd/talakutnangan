import { nextTick } from "vue"
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

	it("should concatenate new schedule", async() => {
		const dayName = "monday"
		const newSchedule = {
			dayName,
			"id": "1",
			"scheduleEnd": 1365,
			"scheduleStart": 1350,
			"type": "employee_schedule"
		}

		const wrapper = shallowMount<any>(Component, {
			"props": {
				dayName,
				"schedules": []
			}
		})
		const newSchedulePicker = wrapper.findComponent({ "name": "SchedulePicker" })
		newSchedulePicker.vm.$emit("pushNewSchedule", newSchedule)

		await nextTick()
		const filledSchedulePicker = wrapper.find(".filled-schedule-picker")
		expect(filledSchedulePicker.attributes("schedulestart"))
		.toEqual(String(newSchedule.scheduleStart))
		expect(filledSchedulePicker.attributes("scheduleend"))
		.toEqual(String(newSchedule.scheduleEnd))
	})
})
