<template>
	<div class="scheduler">
		<div
			v-if="consultantSchedules.data.length"
			class="consultant-has-schedules">
			<p>Please select the day and time from the consultant's available schedules</p>
			<div class="required">
				<SelectableOptionsField
					v-model="chosenDay"
					class="selectable-day"
					label="Day:"
					:options="selectableDays"/>
				<div v-if="isCustomDate" class="selectable date-picker">
					<span>Select a date:</span>
					<input
						v-model="customDate"
						:min="castToCompatibleDate(dateToday)"
						:max="castToCompatibleDate(dateInNextMonth)"
						type="date"/>
				</div>
			</div>

			<div
				v-if="chosenDay"
				:class="selectableTimes.length ? 'required' : ''">
				<SelectableOptionsField
					v-if="selectableTimes.length"
					v-model="chosenTime"
					class="selectable-time"
					label="Time:"
					:options="selectableTimes"/>
				<p v-else class="selected-day-is-past">
					This consultant's schedule for this day has ended.
				</p>
			</div>
		</div>
		<div v-else class="consultant-no-schedules">
			<p class="consultation-no-schedules">
				This consultant has not set any schedules yet.
			</p>
		</div>
	</div>
</template>

<style></style>

<script setup lang="ts">
import { ref, computed } from "vue"

import { Day, DayValues } from "$/types/database"
import type { OptionInfo } from "$@/types/component"
import type { DeserializedEmployeeScheduleListDocument } from "$/types/documents/employee_schedule"

import makeUnique from "$/array/make_unique"
import convertToTitle from "$/string/convert_to_title"

import convertMinutesToTimeObject from "%/helpers/convert_minutes_to_time_object"

import getTimePart from "@/helpers/schedule_picker/get_time_part"
import jumpNextMonth from "@/helpers/schedule_picker/jump_next_month"
import generateTimeRange from "@/helpers/schedule_picker/generate_time_range"
import convertToTimeString from "@/helpers/schedule_picker/convert_time_object_to_time_string"
import castToCompatibleDate from "@/helpers/schedule_picker/convert_date_to_range_compatible_date"

import SelectableOptionsField from "@/fields/selectable_options.vue"

type DefinedProps = {
	consultantSchedules: DeserializedEmployeeScheduleListDocument
	chosenDay: string
	chosenTime: string
}
type CustomEvents = {
	(event: "update:chosenDay", newChosenDay: string): void
	(event: "update:chosenTime", newChosenDay: string): void
}
const props = defineProps<DefinedProps>()
const emit = defineEmits<CustomEvents>()

const dateToday = ref(new Date())
const dateInNextMonth = jumpNextMonth(dateToday.value)
const dayIndex = dateToday.value.getDay()
const reorderedDays = [ ...DayValues.slice(dayIndex), ...DayValues.slice(0, dayIndex) ]

const chosenDay = computed({
	get() { return props.chosenDay },
	set(newValue: string) {
		console.log("set new value", newValue)
		emit("update:chosenDay", newValue)
	}
})
const customDate = ref("")
const isCustomDate = computed(() => chosenDay.value === "custom")
const selectableDays = computed(() => {
	const { consultantSchedules } = props
	const dates: Date[] = []
	if (consultantSchedules.data.length) {
		const consultantDays = makeUnique(
			consultantSchedules.data.map(schedule => schedule.dayName)
		)

		consultantDays.sort((element1, element2) => {
			const element1Index = reorderedDays.indexOf(element1 as Day)
			const element2Index = reorderedDays.indexOf(element2 as Day)

			return Math.sign(element1Index - element2Index)
		})

		for (const day of consultantDays) {
			const dateCounter = new Date()
			const reorderedDayIndex = reorderedDays.indexOf(day)
			dateCounter.setDate(dateCounter.getDate() + reorderedDayIndex)

			dates.push(dateCounter)
		}
	}

	const actualSelectableDays = dates.map(date => {
		const previewDate = date.toDateString().split(" ")
		previewDate.shift()

		return {
			"label": `${convertToTitle(DayValues[date.getDay()])} (${previewDate.join(" ")})`,
			"value": date.toJSON()
		}
	})
	actualSelectableDays.push({
		"label": "Custom...",
		"value": "custom"
	})


	return actualSelectableDays as OptionInfo[]
})

const chosenTime = computed({
	get() { return props.chosenDay },
	set(newValue: string) { emit("update:chosenTime", newValue) }
})
const selectableTimes = computed(() => {
	const { consultantSchedules } = props
	const availableTimes: OptionInfo[] = []
	const dayToDerive = isCustomDate.value && customDate.value
		? customDate.value
		: chosenDay.value

	if (consultantSchedules.data.length && dayToDerive) {
		const convertedDate = new Date(dayToDerive)
		const day = DayValues[convertedDate.getDay()]
		const schedulesByDay = consultantSchedules.data.filter(
			schedule => schedule.dayName === day
		)
		schedulesByDay.forEach(schedule => {
			const times = generateTimeRange({
				"end": schedule.scheduleEnd,
				"start": schedule.scheduleStart
			})

			times.forEach(time => {
				const timeObject = convertMinutesToTimeObject(time)
				const timeString = convertToTimeString(timeObject)
				const midday = getTimePart(time, "midday")
				const label = `${timeString} ${midday}`

				const comparableDate = new Date(chosenDay.value)
				comparableDate.setHours(timeObject.hours)
				comparableDate.setMinutes(timeObject.minutes)
				comparableDate.setSeconds(0)
				comparableDate.setMilliseconds(0)
				if (comparableDate > dateToday.value) {
					availableTimes.push({
						label,
						"value": String(time)
					})
				}
			})
		})
	}

	return availableTimes
})
</script>
