<!--
	TODO: Refactor all WindiCSS inline classes using @apply directive
 -->

<template>
	<div class="schedule-picker">
		<button
			v-if="!isNew && !isEditing"
			id="edit-btn"
			class="btn btn-primary w-[max-content]"
			@click="toggleEditing">
			edit
		</button>
		<div
			v-if="!isNew && isEditing"
			class="buttons">
			<button
				id="save-btn"
				class="btn btn-primary"
				@click="updateTime">
				save
			</button>
			<button
				id="discard-btn"
				class="btn ml-5"
				@click="toggleEditing">
				Discard
			</button>
			<button
				id="delete-btn"
				class="btn ml-5"
				@click="deleteSchedule">
				Delete
			</button>
		</div>
		<button
			v-if="isNew && !isAdding"
			id="add-btn"
			class="btn btn-primary w-[max-content]"
			@click="toggleAdding">
			Add
		</button>
		<div
			v-if="isNew && isAdding"
			class="buttons">
			<button
				id="save-new-btn"
				class="btn btn-primary"
				@click="saveNewSchedule">
				save
			</button>
			<button
				id="discard-new-btn"
				class="btn ml-5"
				@click="toggleAdding">
				Discard
			</button>
		</div>

		<div
			v-if="!isNew || (isNew && isAdding)"
			:class="{ 'is-new': isNew && isAdding }"
			class="time-selectors">
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
						:options="midDays"
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
						:options="midDays"
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
import { computed, inject, ref } from "vue"

import type { Day } from "$/types/database"
import type { OptionInfo } from "$@/types/component"
import type { PageContext } from "$/types/renderer"

import EmployeeScheduleFetcher from "$@/fetchers/employee_schedule"

import convertTimeToMinutes from "$/time/convert_time_to_minutes"

import makeUnique from "$/array/make_unique"
import assignPath from "$@/external/assign_path"
import makeOptionInfo from "$@/helpers/make_option_info"
import getTimePart from "@/helpers/schedule_picker/get_time_part"
import generateTimeRange from "@/helpers/schedule_picker/generate_time_range"
import formatHourTo24Hours from "@/helpers/schedule_picker/format_to_24_hours"
import convertMinutesToTimeObject from "%/helpers/convert_minutes_to_time_object"
import convertToTimeString from "@/helpers/schedule_picker/convert_time_object_to_time_string"

import Selectable from "@/fields/selectable_options.vue"

const fetcher = new EmployeeScheduleFetcher()

const pageContext = inject("pageContext") as PageContext<"deserialized">
const { "pageProps": { "userProfile": { "data": { "id": userId } } } } = pageContext

const props = defineProps<{
	scheduleId?: string
	isNew?: boolean
	dayName: string
	scheduleStart: number
	scheduleEnd: number
}>()

const isEditing = ref(false)
const isAdding = ref(false)
function toggleEditing() {
	isEditing.value = !isEditing.value
}
function toggleAdding() {
	toggleEditing()
	isAdding.value = !isAdding.value
}

const availableTimes = makeOptionInfo(makeUnique(generateTimeRange())) as OptionInfo[]
const midDays = makeOptionInfo([ "AM", "PM" ]) as OptionInfo[]

const startTime = ref(convertToTimeString(
	convertMinutesToTimeObject(props.scheduleStart)
))
const endTime = ref(convertToTimeString(
	convertMinutesToTimeObject(props.scheduleEnd)
))
const startMidDay = ref(getTimePart(props.scheduleStart, "midday"))
const endMidDay = ref(getTimePart(props.scheduleEnd, "midday"))

function formatTo24Hours(time: string) {
	// eslint-disable-next-line prefer-const
	let [ hour, minute ] = time.split(":")
	hour = String(Number(hour) + NOON)

	return `${hour}:${minute}`
}
const startTime24Hours = computed(() => {
	let formattedTime = startTime.value
	if (startMidDay.value === "PM") formattedTime = formatTo24Hours(startTime.value)

	return formattedTime
})
const endTime24Hours = computed(() => {
	let formattedTime = endTime.value
	if (endMidDay.value === "PM") formattedTime = formatTo24Hours(endTime.value)

	return formattedTime
})

function updateTime() {
	fetcher.update(String(props.scheduleId), {
		"dayName": props.dayName as Day,
		"scheduleEnd": convertTimeToMinutes(endTime24Hours.value),
		"scheduleStart": convertTimeToMinutes(startTime24Hours.value)
	}, {
		"extraDataFields": {
			"relationships": {
				"user": {
					"data": {
						"id": userId,
						"type": "user"
					}
				}
			}
		}
	})
}

function saveNewSchedule() {
	fetcher.create({
		"dayName": props.dayName as Day,
		"scheduleEnd": convertTimeToMinutes(endTime24Hours.value),
		"scheduleStart": convertTimeToMinutes(startTime24Hours.value)
	}, {
		"extraDataFields": {
			"relationships": {
				"user": {
					"data": {
						"id": userId,
						"type": "user"
					}
				}
			}
		}
	})
	.then(() => assignPath("/settings/profile"))
}

function deleteSchedule() {
	fetcher.archive([ String(props.scheduleId) ])
	.then(() => assignPath("/settings/profile"))
}
</script>
