<template>
	<div class="scheduler">
		<div
			v-if="hasConsultorSchedules"
			class="consultor-has-schedules">
			<p class="date-and-time-selection-message">
				Please select the day and time from the consultor's available schedules
			</p>

			<div
				class="date-and-time-fields"
				:class="dateAndTimeFieldsClasses">
				<div class="date-field required">
					<SelectableOptionsField
						v-model="chosenDate"
						class="selectable-day"
						label="Day:"
						:options="selectableDays"
						:disabled="isUrgent"/>
					<div v-if="isCustomDate" class="selectable date-picker">
						<span>Select a date:</span>
						<input
							v-model="customDate"
							:min="castToCompatibleDate(dateToday)"
							:max="castToCompatibleDate(dateInNextMonth)"
							type="date"/>
					</div>

					<p v-if="mustShowPastDayError" class="selected-day-is-past">
						This consultor's schedule for this day has ended.
					</p>
				</div>

				<div
					v-if="mustShowTimeField"
					class="time-field"
					:class="hasSelectableTimes ? 'required' : ''">
					<SelectableOptionsField
						v-if="hasSelectableTimes"
						v-model="chosenTime"
						class="selectable-time"
						label="Time:"
						:options="selectableTimes"/>
				</div>
			</div>
		</div>
		<div v-else class="consultor-no-schedules">
			<p class="consultation-no-schedules">
				This consultor has not set any schedules yet.
			</p>
		</div>
	</div>
</template>

<style lang="scss">
	.selectable-day.selectable, .selectable-time.selectable {
		select {
			@apply m-0;
		}
	}
</style>

<style scoped lang="scss">

	.consultor-has-schedules {

		.date-and-time-selection-message {
			@apply mb-4;
		}

		.date-and-time-fields {
			@apply flex flex-col;

			.selected-day-is-past {
				@apply mt-2;
				@apply text-red-500;
			}

			.selectable-day, .selectable-time {
				@apply mb-4;
				@apply flex flex-col items-start;
			}

			@screen md {
				@apply flex-row;


				.time-field {
					@apply ml-4;
				}
			}
		}

		.consultation-no-schedules{
			@apply text-red-500;
		}
	}
</style>

<script setup lang="ts">
import { ref, computed, watch } from "vue"

import { Day, DayValues } from "$/types/database"
import type { OptionInfo } from "$@/types/component"
import type { DeserializedEmployeeScheduleListDocument } from "$/types/documents/employee_schedule"

import makeUnique from "$/array/make_unique"
import convertToTitle from "$/string/convert_to_title"

import convertMinutesToTimeObject from "%/helpers/convert_minutes_to_time_object"

import getTimePart from "@/helpers/schedule_picker/get_time_part"
import jumpNextMonth from "@/helpers/schedule_picker/jump_next_month"
import generateTimeRange from "@/helpers/schedule_picker/generate_time_range"
import castToCompatibleDate from "@/helpers/convert_date_to_range_compatible_date"
import convertToTimeString from "@/helpers/schedule_picker/convert_time_object_to_time_string"

import SelectableOptionsField from "@/fields/selectable_options.vue"

type DefinedProps = {
	consultorSchedules: DeserializedEmployeeScheduleListDocument
	chosenDay: string
	chosenTime: string
	isUrgent?: boolean
}
type CustomEvents = {
	(event: "update:chosenDay", newChosenDay: string): void
	(event: "update:chosenTime", newChosenDay: string): void
}
const props = defineProps<DefinedProps>()
const emit = defineEmits<CustomEvents>()

const CUSTOM_DAY = "custom"
const dateToday = ref<Date>(new Date())
const dateInNextMonth = computed<Date>(() => jumpNextMonth(dateToday.value))
const dayIndex = computed<number>(() => dateToday.value.getDay())
const reorderedDays = computed<Day[]>(
	() => [ ...DayValues.slice(dayIndex.value), ...DayValues.slice(0, dayIndex.value) ]
)

const hasConsultorSchedules = computed<boolean>(() => props.consultorSchedules.data.length > 0)
const selectableDays = computed<OptionInfo[]>(() => {
	const { consultorSchedules } = props
	const dates: Date[] = []
	if (hasConsultorSchedules.value) {
		const consultorDays = makeUnique(
			consultorSchedules.data.map(schedule => schedule.dayName)
		)

		consultorDays.sort((element1, element2) => {
			const element1Index = reorderedDays.value.indexOf(element1 as Day)
			const element2Index = reorderedDays.value.indexOf(element2 as Day)

			return Math.sign(element1Index - element2Index)
		})

		for (const day of consultorDays) {
			const dateCounter = new Date()
			dateCounter.setHours(0)
			dateCounter.setMinutes(0)
			dateCounter.setSeconds(0)
			dateCounter.setMilliseconds(0)
			const reorderedDayIndex = reorderedDays.value.indexOf(day)
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
		"value": CUSTOM_DAY
	})

	return actualSelectableDays as OptionInfo[]
})
watch(selectableDays, newValue => {
	if (newValue.length > 1) {
		emit("update:chosenDay", newValue[0].value)
	}
})

const chosenDate = computed<string>({
	get() {
		if (selectableDays.value.find(day => day.value === props.chosenDay)) {
			return props.chosenDay
		}
		if (props.isUrgent) return selectableDays.value[0].value

		return CUSTOM_DAY
	},
	set(newValue: string) {
		if (newValue === CUSTOM_DAY) {
			emit("update:chosenDay", new Date(castToCompatibleDate(new Date())).toJSON())
		} else {
			const valueToPass = props.isUrgent ? selectableDays.value[0].value : newValue
			emit("update:chosenDay", valueToPass)
		}
	}
})
const isCustomDate = computed<boolean>(() => chosenDate.value === CUSTOM_DAY)
const customDate = ref("")

const mustShowTimeField = computed(() => props.chosenDay && !props.isUrgent)
const chosenTime = computed({
	get() { return props.chosenTime },
	set(newValue: string) { emit("update:chosenTime", newValue) }
})
const selectableTimes = computed(() => {
	const { consultorSchedules } = props
	const availableTimes: OptionInfo[] = []
	const dayToDerive = isCustomDate.value && customDate.value
		? customDate.value
		: chosenDate.value

	if (hasConsultorSchedules.value && dayToDerive) {
		const convertedDate = new Date(dayToDerive)
		const day = DayValues[convertedDate.getDay()]
		const schedulesByDay = consultorSchedules.data.filter(
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

				const comparableDate = new Date(dayToDerive)
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
const hasSelectableTimes = computed(() => selectableTimes.value.length)
const mustShowPastDayError = computed(
	() => !hasSelectableTimes.value
	&& (customDate.value || !isCustomDate.value)
	&& !props.isUrgent
)

watch(customDate, newValue => {
	if (!newValue) {
		chosenDate.value = ""
		chosenTime.value = ""
	}
})

const dateAndTimeFieldsClasses = computed(() => ({
	"has-selected-day": Boolean(chosenDate.value)
}))
</script>
