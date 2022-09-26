<!--
	TODO: Refactor all WindiCSS inline classes using @apply directive
	TODO(lead): Use `employee_schedule` fetcher to modify data
 -->

<template>
	<div class="schedule-picker">
		<button
			v-if="!isNew && !isEditing"
			class="edit-btn btn btn-primary w-[max-content]"
			@click="toggleEditing">
			edit
		</button>
		<div
			v-if="!isNew && isEditing"
			class="buttons">
			<button
				class="save-btn btn btn-primary"
				@click="updateTime">
				save
			</button>
			<button
				class="save-btn btn ml-5"
				@click="toggleEditing">
				Discard
			</button>
		</div>
		<button
			v-if="isNew && !isAdding"
			class="edit-btn btn btn-primary w-[max-content]"
			@click="toggleAdding">
			Add
		</button>
		<div
			v-if="isNew && isAdding"
			class="buttons">
			<button class="save-btn btn btn-primary">
				save
			</button>
			<button
				class="save-btn btn ml-5"
				@click="toggleAdding">
				Discard
			</button>
		</div>

		<div v-if="!isNew || (isNew && isAdding)" class="time-selectors">
			<label class="time-selector">
				<span>From:</span>
				<div id="start" class="start">
					<Selectable
						v-model="startTime"
						class="inline"
						:options="availableTimes"
						:disabled="!isEditing"/>
					<Selectable
						v-model="startMidDay"
						class="inline"
						:options="midDay"
						:disabled="!isEditing"/>
				</div>
			</label>
			<label class="time-selector">
				<span class="to">To:</span>
				<div id="end" class="end">
					<Selectable
						v-model="endTime"
						class="inline"
						:options="availableTimes"
						:disabled="!isEditing"/>

					<Selectable
						v-model="endMidDay"
						class="inline"
						:options="midDay"
						:disabled="!isEditing"/>
				</div>
			</label>
		</div>
	</div>
</template>

<style scoped lang="scss">
	@import "@styles/btn.scss";
	.schedule-picker {
		@apply flex flex-col;
		margin: 2em 0;
	}

	.time-selector{
		@apply flex flex-col justify-between mb-5;

		.start, .end {
			@apply flex justify-between;
		}
	}
</style>

<script setup lang="ts">
import { ref } from "vue"

import type { Day } from "$/types/database"

import Selectable from "@/fields/selectable_options.vue"

import EmployeeScheduleFetcher from "$@/fetchers/employee_schedule"

import convertTimeToMinutes from "$/time/convert_time_to_minutes"

import convertMinutesToTimeObject from "%/managers/helpers/convert_minutes_to_time_object"

const props = defineProps<{
	scheduleId?: string
	isNew?: boolean
	dayName: string
	scheduleStart: number
	scheduleEnd: number
}>()

const noon = 12
const isEditing = ref(false)
const isAdding = ref(false)
function toggleEditing() {
	isEditing.value = !isEditing.value
}
function toggleAdding() {
	toggleEditing()
	isAdding.value = !isAdding.value
}

function twoDigits(number: number) {
	const twoDigitStart = 10
	return number < twoDigitStart ? `0${number}` : number.toString()
}
function formatTo12Hours(hour: number) {
	let convertedHour = 0

	if (hour <= noon) convertedHour = hour
	else convertedHour = hour - noon

	return convertedHour
}
function makeOptions(values: any[]): any[] {
	const options: any[] = []
	// eslint-disable-next-line object-shorthand
	values.map(value => options.push({ "value": value }))

	return options
}
function convertTimeObjectToTimeString(
	timeObject: ReturnType<typeof convertMinutesToTimeObject>
) {
	return `${twoDigits(formatTo12Hours(timeObject.hours))}:${twoDigits(timeObject.minutes)}`
}

function generateNumberRange() {
	const hourEnd = 11
	const minuteEnd = 60
	const start = 0
	const time = []

	for (let i = start; i <= hourEnd; i++) {
		for (let interval = 15, j = start; j < minuteEnd; j += interval) {
			time.push(`${i === 0 ? hourEnd + 1 : twoDigits(i)}:${twoDigits(j)}`)
		}
	}

	return time
}
const availableTimes = makeOptions(generateNumberRange())
const midDay = makeOptions([ "AM", "PM" ])

function getTimePart(time: number, part: "hour" | "minute" | "midday") {
	const timeObject = convertMinutesToTimeObject(time)
	let partToGive = ""

	switch (part) {
		case "hour":
			partToGive = twoDigits(formatTo12Hours(timeObject.hours))
			break
		case "minute":
			partToGive = twoDigits(timeObject.minutes)
			break
		case "midday":
			if (timeObject.hours < noon) partToGive = "AM"
			else partToGive = "PM"
			break

		default:
			break
	}

	return partToGive
}
const startTime = ref(convertTimeObjectToTimeString(
	convertMinutesToTimeObject(props.scheduleStart)
))
const endTime = ref(convertTimeObjectToTimeString(
	convertMinutesToTimeObject(props.scheduleEnd)
))
const startMidDay = ref(getTimePart(props.scheduleStart, "midday"))
const endMidDay = ref(getTimePart(props.scheduleEnd, "midday"))

function updateTime() {
	const fetcher = new EmployeeScheduleFetcher()
	// eslint-disable-next-line prefer-const
	let [ startHour, startMinute ] = startTime.value.split(":")
	// eslint-disable-next-line prefer-const
	let [ endHour, endMinute ] = endTime.value.split(":")

	if (startMidDay.value === "PM") startHour = String(Number(startHour) + noon)
	if (endMidDay.value === "PM") endHour = String(Number(endHour) + noon)

	fetcher.update(props.scheduleId as string, {
		"dayName": props.dayName as Day,
		"scheduleEnd": convertTimeToMinutes(`${endHour}:${endMinute}`),
		"scheduleStart": convertTimeToMinutes(`${startHour}:${startMinute}`)
	})
}

const emit = defineEmits<{(e: "passNewTime", newTime: string): void }>()
</script>
