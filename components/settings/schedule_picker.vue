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
			<div id="start">
				<Selectable
					v-model="startHour"
					class="inline"
					:options="hours"
					@change="setNewTime(startHour, startMinute, startMidDay)"/>
				<Selectable
					v-model="startMinute"
					class="inline"
					:options="minutes"
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
			<div id="end">
				<Selectable
					v-model="endHour"
					class="inline"
					:options="hours"
					@change="setNewTime(endHour, endMinute, endMidDay)"/>
				<Selectable
					v-model="endMinute"
					class="inline"
					:options="minutes"
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
	margin: 1em 0;
}
</style>

<script setup lang="ts">
import { ref } from "vue"

import { DayValues } from "$/types/database"

import Selectable from "@/fields/selectable_options.vue"
import convertForSentence from "$/string/convert_for_sentence"

const { day, startTime, endTime } = defineProps<{
	day: string
	startTime: string | number
	endTime: string | number
}>()

function twoDigits(number: number) {
	return number < 10 ? `0${number}` : number.toString()
}

function generateNumberRange(start: number, end: number) {
	const numbers = []
	for (let i = start; i < end; i++) {
		numbers.push({ "value": twoDigits(i) })
	}

	return numbers
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

const hours = generateNumberRange(1, 13)
const minutes = generateNumberRange(0, 60)
const midDay = makeOptions([ "AM", "PM" ])
const unuseddays = [ ...DayValues ]

const rawStartTime = startTime as string
const startHour = ref(getTimePart(rawStartTime, "hour"))
const startMinute = ref(getTimePart(rawStartTime, "minute"))
const startMidDay = ref(getTimePart(rawStartTime, "midday"))

const rawEndTime = endTime as string
const endHour = ref(getTimePart(rawEndTime, "hour"))
const endMinute = ref(getTimePart(rawEndTime, "minute"))
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
