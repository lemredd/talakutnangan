<!--
	TODO: Refactor all WindiCSS inline classes using @apply directive
	TODO(lead): Use `employee_schedule` fetcher to modify data

 -->

<template>
	<div class="schedule-picker">
		<h3 class="day">
			{{ new TextTransformer().toSentenceCase(day) }}
		</h3>
		<label class="flex">
			<span>From:</span>
			<div id="start">
				<TimeSelect
					class="inline"
					:options="hours"
					:initial-value="initialStartHour"/>
				<TimeSelect
					class="inline"
					:options="minutes"
					:initial-value="initialStartMinute"/>
				<TimeSelect
					class="inline"
					:options="midDay"
					:initial-value="initialStartMidDay"/>
			</div>
		</label>
		<label class="flex">
			<span>to:</span>
			<div id="end">
				<TimeSelect
					class="inline"
					:options="hours"
					:initial-value="initialEndHour"/>
				<TimeSelect
					class="inline"
					:options="minutes"
					:initial-value="initialEndMinute"/>
				<TimeSelect
					class="inline"
					:options="midDay"
					:initial-value="initialEndMidDay"/>
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
import { computed } from "vue"

import Select from "@/fields/dropdown_select.vue"

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
		numbers.push(twoDigits(i))
	}

	return numbers
}

function getTimePart(time: string, part: "hour" | "minute" | "midday"): string {
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
const midDay = [ "AM", "PM" ]
const days = [
	"sunday",
	"monday",
	"tuesday",
	"wednesday",
	"thursday",
	"friday",
	"saturday"
]

const rawStartTime = startTime as string
const initialStartHour = computed(() => getTimePart(rawStartTime, "hour"))
const initialStartMinute = computed(() => getTimePart(rawStartTime, "minute"))
const initialStartMidDay = computed(() => getTimePart(rawStartTime, "midday"))

const rawEndTime = endTime as string
const initialEndHour = computed(() => getTimePart(rawEndTime, "hour"))
const initialEndMinute = computed(() => getTimePart(rawEndTime, "minute"))
const initialEndMidDay = computed(() => getTimePart(rawEndTime, "midday"))

	if (Number(hour) < 12) return hour
	return twoDigits(Number(hour) - 12)
})
const initialEndMinute = computed(() => {
	const [ unusedhour, minute ] = rawEndTime.split(":")

	return minute
})
const initialEndMidDay = computed(() => {
	const [ hour ] = rawEndTime.split(":")

	if (Number(hour) < 12) return "AM"
	return "PM"
})
console.log(initialEndHour.value, ":", initialEndMinute.value, initialEndMidDay.value)
</script>
