<!--
	TODO(lead): Use `employee_schedule` fetcher to modify data

 -->

<template>
	<div class="schedule-picker-group">
		<div class="schedule-picker-header">
			<h3 class="day mb-2">
				{{ convertForSentence(dayName) }}
			</h3>
		</div>

		<SchedulePicker
			v-for="schedule in daySchedules"
			:key="schedule.id"
			:schedule-id="schedule.id"
			:day-name="schedule.dayName"
			:schedule-start="schedule.scheduleStart"
			:schedule-end="schedule.scheduleEnd"/>

		<SchedulePicker
			:is-new="true"
			:day-name="props.dayName"
			:schedule-start="convertTimeToMinutes('00:00')"
			:schedule-end="convertTimeToMinutes('00:00')"/>
	</div>
</template>

<style scoped lang="scss">
	@import "@styles/btn.scss";
	.schedule-picker-group {
		border-bottom: 1px solid black;
		margin-bottom: 1em;
	}

	.schedule-picker-header {
		@apply flex flex-col justify-between mb-5;
	}
</style>

<script setup lang="ts">
import { computed } from "vue"

import type { DeserializedEmployeeScheduleResource } from "$/types/documents/employee_schedule"

import SchedulePicker from "@/settings/schedule_picker.vue"
import convertForSentence from "$/string/convert_for_sentence"
import convertTimeToMinutes from "$/time/convert_time_to_minutes"

const props = defineProps<{
	dayName: string
	schedules: DeserializedEmployeeScheduleResource[]
}>()

const daySchedules = computed<DeserializedEmployeeScheduleResource[]>(
	() => props.schedules.filter(schedule => schedule.dayName === props.dayName)
)
</script>
