<template>
	<div class="schedule-picker">
		<h3 class="display-name text-lg col-span-full flex">
			{{ day }}
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
</style>

<script setup lang="ts">
import { ref, computed } from "vue"

import TimeSelect from "@/fields/dropdown_select.vue"

const { day, startTime, endTime } = defineProps<{
	day: string
	startTime: string | number
	endTime: string | number
}>()

function twoDigits(number: number) {
	return number < 10 ? `0${number}` : number
}
function generateNumberRange(start: number, end: number) {
	const numbers = []
	for (let i = start; i < end; i++) {
		numbers.push(twoDigits(i))
	}

	return numbers
}

const hours = generateNumberRange(1, 13)
const minutes = generateNumberRange(0, 60)
const midDay = [ "AM", "PM" ]

const rawStartTime = startTime as string
const initialStartHour = computed(() => {
	const [ hour ] = rawStartTime.split(":")

	if (Number(hour) < 12) return hour
	return twoDigits(Number(hour) - 12)
})
const initialStartMinute = computed(() => {
	const [ unusedhour, minute ] = rawStartTime.split(":")

	return minute
})
const initialStartMidDay = computed(() => {
	const [ hour ] = rawStartTime.split(":")

	if (Number(hour) < 12) return "AM"
	return "PM"
})
console.log(initialStartHour.value, ":", initialStartMinute.value, initialStartMidDay.value)

const rawEndTime = endTime as string
const initialEndHour = computed(() => {
	const [ hour ] = rawEndTime.split(":")

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
