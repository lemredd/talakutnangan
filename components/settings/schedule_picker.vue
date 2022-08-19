<template>
	<div class="schedule-picker">
		<h3 class="display-name text-lg col-span-full flex">{{ day }}</h3>
			<label class="flex">
				<span>From:</span>
				<div id="end">
					<TimeSelect class="inline" :options="hours" />
					<TimeSelect class="inline" :options="minutes" />
					<TimeSelect class="inline" :options="midDay" />
				</div>
			</label>
			<label class="flex">
				<span>to:</span>
				<div id="end">
					<TimeSelect class="inline" :options="hours" />
					<TimeSelect class="inline" :options="minutes" />
					<TimeSelect class="inline" :options="midDay" />
				</div>
			</label>
	</div>
</template>

<style scoped lang="scss">
</style>

<script setup lang="ts">
import { ref, onMounted } from "vue"

import TimeSelect from "@/fields/dropdown_select.vue"

const { day, startTime, endTime } = defineProps<{
	day: string
	startTime: number | string
	endTime: number | string
}>()

const inputEndTime = ref<HTMLInputElement | null>()
const hours = generateNumberRange(1, 13)
const minutes = generateNumberRange(0, 60)
const midDay = ["AM", "PM"]

function twoDigits(number: number) {
	return number < 10 ? `0${number}` : number
}
function generateNumberRange(start: number, end: number) {
	const numbers = []
	for(let i = start; i < end; start++) {
		numbers.push(twoDigits(start))
	}

	return numbers
}

onMounted(() => {
	console.log(inputEndTime.value!.value)
})
</script>
