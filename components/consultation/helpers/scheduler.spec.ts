import convertTimeToMinutes from "$/time/convert_time_to_minutes"
import { shallowMount } from "@vue/test-utils"

import Component from "./scheduler.vue"

describe.skip("Component: consultation/helpers/scheduler", () => {
	it("can select within employee's schedules", async() => {
		const schedules = {
			"data": [
				{
					"attributes": {
						"dayName": "monday",
						"scheduleEnd": convertTimeToMinutes("09:00"),
						"scheduleStart": convertTimeToMinutes("08:00")
					},
					"id": "1",
					"type": "employee_schedule"
				}
			],
			"meta": {
				"count": 1
			}
		} as any

		const wrapper = shallowMount(Component, {
			"global": {
				"stubs": {
					"SelectableOptionsField": false
				}
			},
			"props": {
				"chosenDay": "",
				"chosenTime": "",
				"consultantSchedules": schedules
			}
		})

		// Load selectable days and its options
		const currentHour = 8
		const castedWrapper = wrapper.vm as any
		castedWrapper.dateToday = new Date()
		castedWrapper.dateToday.setHours(currentHour)
		console.log(castedWrapper.dateToday)
		const selectableDay = wrapper.find(".selectable-day")
		expect(selectableDay.exists()).toBeTruthy()
		const dayOptions = selectableDay.findAll("option")
		expect(dayOptions).toHaveLength(3)

		// Load selectable times and its options
		const chosenDay = dayOptions[1].attributes("value")
		const selectableDayField = selectableDay.find("select")
		console.log(selectableDayField.html(), "\n\n\n")
		await selectableDayField.setValue(chosenDay)
		await wrapper.setProps({ chosenDay })
		console.log(wrapper.html(), "\n\n\n")
		const selectableTime = wrapper.find(".selectable-time")
		expect(selectableTime.exists()).toBeTruthy()
		// const timeOptions = selectableTime.findAll("option")
		// expect(selectableTime.exists()).toBeTruthy()
		// expect(timeOptions.length).toBeGreaterThan(0)

		// Customizable date
		// await selectableDayField.setValue(dayOptions[2].attributes("value"))
		// expect(selectableTime.exists()).toBeTruthy()
		// expect(timeOptions.length).toBeGreaterThan(0)
	})
})
