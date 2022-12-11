<template>
	<div class="schedule-picker-group">
		<div class="schedule-picker-header">
			<h3 class="day">
				{{ convertForSentence(dayName) }}
			</h3>
		</div>

		<div class="schedule-pickers">
			<SchedulePicker
				v-for="schedule in daySchedules"
				:key="schedule.id"
				:disabled="disabled"
				:schedule-id="schedule.id"
				:day-name="schedule.dayName"
				:schedule-start="schedule.scheduleStart"
				:schedule-end="schedule.scheduleEnd"
				class="schedule-picker filled-schedule-picker"/>

			<SchedulePicker
				:is-new="true"
				:disabled="disabled"
				:day-name="dayName"
				:schedule-start="convertTimeToMinutes('00:00')"
				:schedule-end="convertTimeToMinutes('00:00')"
				class="schedule-picker new-schedule-picker"
				@push-new-schedule="pushNewSchedule"/>
		</div>
	</div>
</template>

<style scoped lang="scss">
	@import "@styles/btn.scss";
	.schedule-picker-group {
		@apply mt-4 mb-12 p-4;
		@apply border border-gray-300 rounded-md;
		max-height: 640px;
		max-width: 300px;
		overflow-y: scroll;

		.schedule-picker-header {
			@apply flex flex-col justify-between mb-5;

			.day {
				@apply text-lg;
			}
		}

		.schedule-pickers {
			@apply flex flex-col justify-start;
		}
	}

</style>

<script setup lang="ts">
import { ref } from "vue"

import type { DeserializedEmployeeScheduleResource } from "$/types/documents/employee_schedule"

import SchedulePicker from "@/settings/schedule_picker.vue"
import convertForSentence from "$/string/convert_for_sentence"
import convertTimeToMinutes from "$/time/convert_time_to_minutes"

const props = defineProps<{
	dayName: string
	disabled: boolean
	schedules: DeserializedEmployeeScheduleResource[]
}>()

const daySchedules = ref<DeserializedEmployeeScheduleResource[]>(
	props.schedules.filter(schedule => schedule.dayName === props.dayName)
)

function pushNewSchedule(newSchedule: DeserializedEmployeeScheduleResource) {
	daySchedules.value = [
		...daySchedules.value,
		newSchedule
	]
}
</script>
