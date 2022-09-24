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
			<button class="save-btn btn btn-primary">
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

import Selectable from "@/fields/selectable_options.vue"
import convertMinutesToTimeObject from "%/managers/helpers/convert_minutes_to_time_object"

function convertTimeObjectToTimeString(
	timeObject: ReturnType<typeof convertMinutesToTimeObject>
) {
	return `${timeObject.hours}:${timeObject.minutes}`
}

const props = defineProps<{
	isNew?: boolean
	scheduleStart: number
	scheduleEnd: number
}>()

const isEditing = ref(false)
const isAdding = ref(false)
function toggleEditing() {
	isEditing.value = !isEditing.value
}
function toggleAdding() {
	isAdding.value = !isAdding.value
}

function twoDigits(number: number) {
	return number < 10 ? `0${number}` : number.toString()
}

function makeOptions(values: any[]): any[] {
	const options: any[] = []
	// eslint-disable-next-line object-shorthand
	values.map(value => options.push({ "value": value }))

	return options
}

function getTimePart(time: number, part: "hour" | "minute" | "midday") {
	const noon = 12
	const timeObject = convertMinutesToTimeObject(time)
	let partToGive = ""

	if (part === "hour") {
		if (timeObject.hours <= noon) partToGive = String(timeObject.hours)
		else partToGive = twoDigits(timeObject.hours - noon)
	}

	if (part === "minute") partToGive = String(timeObject.minutes)

	if (part === "midday") {
		if (timeObject.hours < noon) partToGive = "AM"
		else partToGive = "PM"
	}

	return partToGive
}

function generateNumberRange() {
	const hourEnd = 11
	const minuteEnd = 60
	const start = 0
	const time = []

	for (let i = start; i <= hourEnd; i++) {
		for (let j = start; j < minuteEnd; j += 15) {
			time.push(`${i === 0 ? 12 : twoDigits(i)}:${twoDigits(j)}`)
		}
	}

	return time
}
const availableTimes = makeOptions(generateNumberRange())
const midDay = makeOptions([ "AM", "PM" ])

const startTime = ref(convertTimeObjectToTimeString(
	convertMinutesToTimeObject(props.scheduleStart)
))
const endTime = ref(convertTimeObjectToTimeString(
	convertMinutesToTimeObject(props.scheduleEnd)
))
const startMidDay = ref(getTimePart(props.scheduleStart, "midday"))
const endMidDay = ref(getTimePart(props.scheduleEnd, "midday"))

function setNewTime(hour: string, minute: string, oldMidDay: string) {
	const newHour = oldMidDay === "PM"
		? Number(hour) + 12
		: Number(hour)

	const newTime = `${newHour}:${minute}`
	emit("passNewTime", newTime)
}

const emit = defineEmits<{(e: "passNewTime", newTime: string): void }>()
</script>
