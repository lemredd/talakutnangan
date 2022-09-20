<!--
	TODO: Refactor all WindiCSS inline classes using @apply directive
	TODO(lead): Use `employee_schedule` fetcher to modify data

 -->

<template>
	<div class="schedule-picker">
		<h3 class="day">
			{{ convertForSentence(day) }}
		</h3>
		<label class="flex">
			<span>From:</span>
			<div id="start" class="flex">
				<Selectable
					v-model="startTime"
					class="inline"
					:options="time"
					@change="setNewTime(startHour, startMinute, startMidDay)"/>
				<Selectable
					v-model="startMidDay"
					class="inline"
					:options="midDay"
					@change="setNewTime(startHour, startMinute, startMidDay)"/>
			</div>
		</label>
		<label class="flex">
			<span>to:</span>
			<div id="end" class="flex">
				<Selectable
					v-model="endTime"
					class="inline"
					:options="time"
					@change="setNewTime(endHour, endMinute, endMidDay)"/>

				<Selectable
					v-model="endMidDay"
					class="inline"
					:options="midDay"
					@change="setNewTime(endHour, endMinute, endMidDay)"/>
			</div>
		</label>
	</div>
</template>

<style scoped lang="scss">
.schedule-picker {
	@apply flex flex-col justify-between;
	margin: 1em 0;
}
</style>

<script setup lang="ts">
import { ref } from "vue"

import { DayValues } from "$/types/database"

import Selectable from "@/fields/selectable_options.vue"
import convertForSentence from "$/string/convert_for_sentence"

const props = defineProps<{
	day: string
	startTime: string
	endTime: string
}>()

function twoDigits(number: number) {
	return number < 10 ? `0${number}` : number.toString()
}

function makeOptions(values: any[]): any[] {
	const options: any[] = []
	// eslint-disable-next-line object-shorthand
	values.map(value => options.push({ "value": value }))

	return options
}

function getTimePart(time: string, part: "hour" | "minute" | "midday") {
	const noon = 12
	const [ hour, minute ] = time.split(":")
	let partToGive = ""

	if (part === "hour") {
		if (Number(hour) <= noon) partToGive = hour
		else partToGive = twoDigits(Number(hour) - noon) as string
	}

	if (part === "minute") partToGive = minute

	if (part === "midday") {
		if (Number(hour) < 12) partToGive = "AM"
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
const time = makeOptions(generateNumberRange())
const midDay = makeOptions([ "AM", "PM" ])
const unuseddays = [ ...DayValues ]

const rawStartTime = props.startTime as string
const startHour = ref(getTimePart(rawStartTime, "hour"))
const startMinute = ref(getTimePart(rawStartTime, "minute"))
const { startTime } = props
const startMidDay = ref(getTimePart(rawStartTime, "midday"))

const rawEndTime = props.endTime as string
const endHour = ref(getTimePart(rawEndTime, "hour"))
const endMinute = ref(getTimePart(rawEndTime, "minute"))
const { endTime } = props
const endMidDay = ref(getTimePart(rawEndTime, "midday"))

function setNewTime(hour: string, minute: string, oldMidDay: string) {
	const newHour = oldMidDay === "PM"
		? Number(hour) + 12
		: Number(hour)

	const newTime = `${newHour}:${minute}`
	emit("passNewTime", newTime)
}

const emit = defineEmits<{(e: "passNewTime", newTime: string): void }>()
</script>
