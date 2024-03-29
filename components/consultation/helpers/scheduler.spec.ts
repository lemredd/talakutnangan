import { shallowMount } from "@vue/test-utils"

import { DayValues } from "$/types/database"

import convertTimeToMinutes from "$/time/convert_time_to_minutes"

import Component from "./scheduler.vue"
import convertToCompatibleDate from "@/helpers/convert_date_to_range_compatible_date"

describe("Component: consultation/helpers/scheduler", () => {
	it("can fill consultor schedules", async() => {
		const currentTime = new Date()
		const currentHour = 8
		currentTime.setHours(currentHour)
		currentTime.setMinutes(0)
		currentTime.setSeconds(0)
		currentTime.setMilliseconds(0)

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

		const defaultDay = new Date(currentTime)
		defaultDay.setHours(0)

		const wrapper = shallowMount(Component, {
			"props": {
				"chosenDay": "",
				"chosenTime": "",
				"consultorSchedules": {
					"data": [],
					"meta": {
						"count": 0
					}
				}
			}
		})

		// Load selectable days and its options
		const castedWrapper = wrapper.vm as any
		castedWrapper.dateToday = currentTime

		await wrapper.setProps({
			"consultorSchedules": schedules
		})

		// Customizable date
		const emitted = wrapper.emitted()
		expect(emitted).toHaveProperty("update:chosenDay.0.0", defaultDay.toJSON())
	})

	it("can select within employee's schedules", async() => {
		const currentTime = new Date()
		const currentHour = 8
		currentTime.setHours(currentHour)
		currentTime.setMinutes(0)
		currentTime.setSeconds(0)
		currentTime.setMilliseconds(0)

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

		const defaultDay = new Date(currentTime)
		defaultDay.setHours(0)

		const wrapper = shallowMount(Component, {
			"props": {
				"chosenDay": defaultDay.toJSON(),
				"chosenTime": "",
				"consultorSchedules": schedules
			}
		})

		// Load selectable days and its options
		const castedWrapper = wrapper.vm as any
		castedWrapper.dateToday = currentTime

		const selectableDay = wrapper
		.find(".selectable-day")
		.findComponent({ "name": "SelectableOptionsField" })
		await selectableDay.vm.$emit("update:modelValue", defaultDay.toJSON())
		await wrapper.setProps({
			"chosenDay": defaultDay.toJSON()
		})
		const selectableTime = wrapper
		.find(".selectable-time")
		.findComponent({ "name": "SelectableOptionsField" })
		const chosenTime = convertTimeToMinutes("08:30")
		await selectableTime.vm.$emit("update:modelValue", chosenTime)

		// Customizable date
		const emitted = wrapper.emitted()
		expect(emitted).toHaveProperty("update:chosenDay.0.0", defaultDay.toJSON())
		expect(emitted).toHaveProperty("update:chosenTime.0.0", chosenTime)
	})

	it("can select custom within employee's schedules", async() => {
		const currentTime = new Date()
		const currentHour = 8
		currentTime.setHours(currentHour)
		currentTime.setMinutes(0)
		currentTime.setSeconds(0)
		currentTime.setMilliseconds(0)

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

		const defaultDay = new Date(currentTime)
		defaultDay.setHours(0)

		const wrapper = shallowMount(Component, {
			"props": {
				"chosenDay": defaultDay.toJSON(),
				"chosenTime": "",
				"consultorSchedules": schedules
			}
		})

		// Load selectable days and its options
		const castedWrapper = wrapper.vm as any
		castedWrapper.dateToday = currentTime

		const selectableDay = wrapper
		.find(".selectable-day")
		.findComponent({ "name": "SelectableOptionsField" })
		await selectableDay.setValue(castedWrapper.CUSTOM_DAY)
		await wrapper.setProps({ "chosenDay": currentTime.toJSON() })
		const customDateField = wrapper.find(".selectable.date-picker input")
		const chosenDate = convertToCompatibleDate(currentTime)
		await customDateField.setValue(chosenDate)
		await wrapper.setProps({ "chosenDay": new Date(chosenDate).toJSON() })
		const selectableTime = wrapper
		.find(".selectable-time")
		.findComponent({ "name": "SelectableOptionsField" })
		const chosenTime = convertTimeToMinutes("08:30")
		await selectableTime.vm.$emit("update:modelValue", chosenTime)

		// Customizable date
		const emitted = wrapper.emitted()
		expect(emitted).toHaveProperty("update:chosenDay.0.0", defaultDay.toJSON())
		expect(emitted).toHaveProperty("update:chosenTime.0.0", chosenTime)
	})

	it("can determine if consultor is not available for the selected day", async() => {
		const currentTime = new Date()
		const currentHour = 10
		currentTime.setHours(currentHour)
		currentTime.setMinutes(0)
		currentTime.setSeconds(0)
		currentTime.setMilliseconds(0)

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

		const defaultDay = new Date(currentTime)
		defaultDay.setHours(0)

		const wrapper = shallowMount(Component, {
			"props": {
				"chosenDay": defaultDay.toJSON(),
				"chosenTime": "",
				"consultorSchedules": schedules
			}
		})

		// Load selectable days and its options
		const castWrapper = wrapper.vm as any
		castWrapper.dateToday = currentTime

		const selectableDay = wrapper
		.find(".selectable-day")
		.findComponent({ "name": "SelectableOptionsField" })
		await selectableDay.vm.$emit("update:modelValue", defaultDay.toJSON())
		await wrapper.setProps({
			"chosenDay": defaultDay.toJSON()
		})

		const selectedDayIsPast = wrapper.find(".selected-day-is-past")
		expect(selectedDayIsPast.exists()).toBeTruthy()
	})
})
