<template>
	<div class="schedule-picker">
		<ReceivedErrors
			v-if="receivedErrors.length"
			:received-errors="receivedErrors"
			class="status-message-container"/>
		<ReceivedSuccessMessages
			v-if="successMessages.length"
			:received-success-messages="successMessages"
			class="status-message-container"/>

		<button
			v-if="!isNew && !isEditing"
			id="edit-btn"
			class="btn btn-primary"
			:disabled="disabled"
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
				class="btn"
				@click="discard">
				Discard
			</button>
			<button
				id="delete-btn"
				class="btn"
				@click="deleteSchedule">
				Delete
			</button>
		</div>
		<button
			v-if="isNew && !isAdding"
			id="add-btn"
			class="btn btn-primary"
			:disabled="disabled"
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
				class="btn"
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
		@apply my-8;

		position: relative;

		.buttons {
			@apply flex flex-col;

			.btn {
				@apply my-2;
			}
		}

		.status-message-container {
			margin-top: -40px;
			position: absolute;
		}
	}

	.time-selector{
		@apply flex flex-col justify-between mb-5;

		.start, .end {
			@apply flex;
		}
	}
</style>

<script setup lang="ts">
import { computed, inject, Ref, ref, watch } from "vue"

import type { Day } from "$/types/database"
import type { OptionInfo } from "$@/types/component"
import type { PageContext } from "$/types/renderer"

import { MILLISECOND_IN_A_SECOND } from "$/constants/numerical"
import type { DeserializedEmployeeScheduleResource } from "$/types/documents/employee_schedule"

import EmployeeScheduleFetcher from "$@/fetchers/employee_schedule"

import convertTimeToMinutes from "$/time/convert_time_to_minutes"

import makeUnique from "$/array/make_unique"
import makeSwitch from "$@/helpers/make_switch"
import assignPath from "$@/external/assign_path"
import makeOptionInfo from "$@/helpers/make_option_info"
import getTimePart from "@/helpers/schedule_picker/get_time_part"
import fillSuccessMessages from "$@/helpers/fill_success_messages"
import generateTimeRange from "@/helpers/schedule_picker/generate_time_range"
import formatHourTo24Hours from "@/helpers/schedule_picker/format_to_24_hours"
import convertMinutesToTimeObject from "%/helpers/convert_minutes_to_time_object"
import convertToTimeString from "@/helpers/schedule_picker/convert_time_object_to_time_string"

import Selectable from "@/fields/selectable_options.vue"
import extractAllErrorDetails from "$@/helpers/extract_all_error_details"
import ReceivedErrors from "@/helpers/message_handlers/received_errors.vue"
import ReceivedSuccessMessages from "@/helpers/message_handlers/received_success_messages.vue"

const pageContext = inject("pageContext") as PageContext<"deserialized">
const { "pageProps": { "userProfile": { "data": { "id": userId } } } } = pageContext

type Props = {
	scheduleId?: string
	isNew?: boolean
	dayName: string
	disabled: boolean
	scheduleStart: number
	scheduleEnd: number
}
type CustomEvents = {
	(event: "pushNewSchedule", newSchedule: DeserializedEmployeeScheduleResource): void
}

const props = defineProps<Props>()
const emit = defineEmits<CustomEvents>()

const {
	"state": isEditing,
	"toggle": toggleEditing,
	"off": stopEditing
} = makeSwitch(false)
const {
	"state": isAdding,
	"toggle": rawToggleAdding
} = makeSwitch(false)

function toggleAdding() {
	toggleEditing()
	rawToggleAdding()
}
const receivedErrors = ref<string[]>([])
const successMessages = ref<string[]>([])
function clearMessages(messageList: Ref<string[]>) {
	messageList.value = []
}

const availableTimeObjects = generateTimeRange().map(
	timeInMinutes => convertMinutesToTimeObject(timeInMinutes)
)
const availableTimeStrings = availableTimeObjects.map(
	timeObject => convertToTimeString(timeObject)
)
const availableTimes = makeOptionInfo(makeUnique(availableTimeStrings)) as OptionInfo[]
const midDays = makeOptionInfo([ "AM", "PM" ]) as OptionInfo[]

const startTime = ref(convertToTimeString(
	convertMinutesToTimeObject(props.scheduleStart)
))
const endTime = ref(convertToTimeString(
	convertMinutesToTimeObject(props.scheduleEnd)
))
const startMidDay = ref<"AM"|"PM">(getTimePart(props.scheduleStart, "midday") as "AM"|"PM")
const endMidDay = ref<"AM"|"PM">(getTimePart(props.scheduleEnd, "midday") as "AM"|"PM")
watch([
	startTime,
	endTime,
	startMidDay,
	endMidDay
], () => {
	if (receivedErrors.value.length) clearMessages(receivedErrors)
	if (successMessages.value.length) clearMessages(successMessages)
})

function discard() {
	// Restore the previous values
	startTime.value = convertToTimeString(convertMinutesToTimeObject(props.scheduleStart))
	endTime.value = convertToTimeString(convertMinutesToTimeObject(props.scheduleEnd))
	startMidDay.value = getTimePart(props.scheduleStart, "midday") as "AM"|"PM"
	endMidDay.value = getTimePart(props.scheduleEnd, "midday") as "AM"|"PM"
	stopEditing()
}

function formatTo24Hours(time: string, midday: "AM" | "PM") {
	// eslint-disable-next-line prefer-const
	let [ hour, minute ] = time.split(":")
	hour = String(formatHourTo24Hours(Number(hour), midday))

	return `${hour}:${minute}`
}
const startTime24Hours = computed(() => {
	const formattedTime = formatTo24Hours(startTime.value, startMidDay.value)

	return formattedTime
})
const endTime24Hours = computed(() => {
	const formattedTime = formatTo24Hours(endTime.value, endMidDay.value)

	return formattedTime
})

const fetcher = new EmployeeScheduleFetcher()
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
	.then(() => {
		const customMessage = "Time updated successfully."
		fillSuccessMessages(receivedErrors, successMessages, customMessage, true)
		stopEditing()
	})
	.catch(responseWithErrors => extractAllErrorDetails(
		responseWithErrors,
		receivedErrors,
		successMessages
	))
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
	.then(({ body }) => {
		const { data } = body
		emit("pushNewSchedule", data)
		discard()
		toggleEditing()
	})
	.catch(responseWithErrors => extractAllErrorDetails(
		responseWithErrors,
		receivedErrors,
		successMessages
	))
}

function deleteSchedule() {
	fetcher.archive([ String(props.scheduleId) ])
	.then(() => {
		const customMessage = "Schedule has been deleted."
		fillSuccessMessages(receivedErrors, successMessages, customMessage, true)
		setTimeout(() => assignPath("/settings/profile"), MILLISECOND_IN_A_SECOND)
	})
	.catch(responseWithErrors => extractAllErrorDetails(responseWithErrors, receivedErrors))
}
</script>
