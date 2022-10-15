<template>
	<Overlay :is-shown="isShown" @close="emitClose">
		<template #header>
			<h1>Enter the consultation details</h1>
		</template>

		<template #default>
			<SearchableChip
				v-model="selectedConsultants"
				class="consultant required"
				header="Consultant"
				:maximum-participants="MAX_CONSULTANTS"
				text-field-label="Type the employee to add"
				kind="reachable_employee"/>

			<div v-if="selectedConsultants.length" class="required">
				<SelectableOptionsField
					v-model="addressConsultantAs"
					class="consultant-roles"
					label="Address consultant as:"
					:options="consultantRoles"/>
			</div>

			<SearchableChip
				v-model="selectedConsulters"
				:current-user-id="userProfileData.id"
				class="consulters"
				header="Consulters"
				:maximum-participants="MAX_CONSULTERS"
				text-field-label="Type the students to add"
				kind="student"/>

			<div class="required">
				<SelectableOptionsField
					v-model="chosenReason"
					class="reason"
					label="Kind of Reason: "
					placeholder="Choose your reason"
					:options="reasonOptions"/>
			</div>

			<NonSensitiveTextField
				v-if="hasChosenOtherReason"
				v-model="otherReason"
				class="other-reason required"
				label="What are the other reasons(s)?"
				type="text"/>
			<div
				v-if="selectedConsultants.length"
				class="schedule-selector">
				<div
					v-if="consultantSchedules.length"
					class="consultant-has-schedules">
					<p>Please select the day and time from the consultant's available schedules</p>
					<div class="required">
						<SelectableOptionsField
							v-model="chosenDay"
							class="selectable-day"
							label="Day:"
							:options="selectableDays"/>
						<div v-if="isCustomDate" class="selectable date-picker">
							<span>Select a date:</span>
							<input
								v-model="customDate"
								:min="castToCompatibleDate(dateToday)"
								:max="castToCompatibleDate(dateInNextMonth)"
								type="date"/>
						</div>
					</div>

					<div
						v-if="chosenDay"
						:class="selectableTimes.length ? 'required' : ''">
						<SelectableOptionsField
							v-if="selectableTimes.length"
							v-model="chosenTime"
							class="selectable-time"
							label="Time:"
							:options="selectableTimes"/>
						<p v-else class="selected-day-is-past">
							This consultant's schedule for this day has ended.
						</p>
					</div>
				</div>
				<div v-else class="consultant-no-schedules">
					<p class="consultation-no-schedules">
						This consultant has not set any schedules yet.
					</p>
				</div>
			</div>

			<div class="signature-message">
				By submitting, your signatures will be applied on the printable consultation form.
			</div>

			<div v-if="hasConflicts">
				<input
					v-model="forceCreate"
					class="warning-message"/>
				Consultation is already on-going. Please wait for your turn.
			</div>
		</template>

		<template #footer>
			<button
				class="btn btn-back"
				type="button"
				@click="emitClose">
				Back
			</button>
			<button
				class="btn submit-btn btn-primary"
				:disabled="!isRequiredInfoCompleted"
				type="button"
				@click="addConsultation">
				Submit
			</button>
		</template>
	</Overlay>
</template>

<style lang="scss">
@import "@styles/btn.scss";

.btn{
  border: none;
  color: white;
  padding: 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
}

.selectable {
	@apply flex justify-between;

	select {
		// TODO: hide top and bottom borders that are not styled
		@apply dark:bg-transparent dark:text-white;

		option {
			@apply dark:bg-dark-200 dark:text-white
		}
	}

	max-width: initial !important;
}

.consultation-no-schedules{
	@apply text-red-500;
}

.signature-message, .warning-message{
		@apply text-xs mt-5;
	}
</style>

<style scoped lang="scss">
@import "@styles/variables.scss";

.required{
	&::before {
		@apply text-xs;

		display:block;
		color: $color-primary;
		content:"* required";

	}
}

.consultant-roles {
	@apply mb-5;
}

.schedule-selector {
	@apply mt-5;
	.selectable-day, .selectable-time {
		margin: 1em 0 1em;
	}
}

 .selected-day-is-past{
	@apply text-red-500;
 }
</style>

<script setup lang="ts">
import { ref, computed, onMounted, inject, watch } from "vue"

import { Day, DayValues } from "$/types/database"
import type { PageContext } from "$/types/renderer"
import type { OptionInfo } from "$@/types/component"
import type { DeserializedUserResource } from "$/types/documents/user"
import type { DeserializedEmployeeScheduleResource } from "$/types/documents/employee_schedule"

import { reasons } from "$@/constants/options"

import Fetcher from "$@/fetchers/consultation"

import Overlay from "@/helpers/overlay.vue"
import makeUnique from "$/array/make_unique"
import assignPath from "$@/external/assign_path"
import makeOptionInfo from "$@/helpers/make_option_info"
import getTimePart from "@/helpers/schedule_picker/get_time_part"
import EmployeeScheduleFetcher from "$@/fetchers/employee_schedule"
import NonSensitiveTextField from "@/fields/non-sensitive_text.vue"
import SelectableOptionsField from "@/fields/selectable_options.vue"
import Checkbox from "@/fields/checkbox.vue"
import SearchableChip from "@/consultation/form/searchable_chip.vue"
import jumpNextMonth from "@/helpers/schedule_picker/jump_next_month"
import generateTimeRange from "@/helpers/schedule_picker/generate_time_range"
import convertMinutesToTimeObject from "%/helpers/convert_minutes_to_time_object"
import convertToTimeString from "@/helpers/schedule_picker/convert_time_object_to_time_string"
import castToCompatibleDate from "@/helpers/schedule_picker/convert_date_to_range_compatible_date"

const { isShown } = defineProps<{ isShown: boolean }>()

const { pageProps }
= inject("pageContext") as PageContext<"deserialized", "consultations">
const { "userProfile": { "data": userProfileData } }
= pageProps

let rawFetcher: Fetcher|null = null

function fetcher(): Fetcher {
	if (rawFetcher === null) throw new Error("Consultation cannot be processed yet")

	return rawFetcher
}

const reasonOptions = reasons.map(reason => ({ "value": reason }))
const chosenReason = ref<typeof reasons[number]>("Grade-related")
const hasChosenOtherReason = computed<boolean>(() => chosenReason.value === "Others")
const emit = defineEmits([ "close" ])
function emitClose() {
	emit("close")
}
const otherReason = ref<string>("")
const reason = computed<string>(() => {
	if (hasChosenOtherReason.value) return otherReason.value
	return chosenReason.value
})
const forceCreate = ref<boolean>(true)
const hasConflicts = ref<boolean>(false)

const MAX_CONSULTANTS = 1
const selectedConsultants = ref<DeserializedUserResource<"roles">[]>([])
const consultantRoles = computed(() => {
	const roleIDs: string[] = []
	const labels: string[] = []

	if (selectedConsultants.value.length) {
		const [ consultant ] = selectedConsultants.value
		consultant.roles.data.forEach(role => roleIDs.push(String(role.id)))
		consultant.roles.data.forEach(role => labels.push(role.name))
	}

	return makeOptionInfo(roleIDs, labels) as OptionInfo[]
})
const addressConsultantAs = ref("")

const MAX_CONSULTERS = 5
const selectedConsulters = ref<DeserializedUserResource<"studentDetail">[]>([
	userProfileData as DeserializedUserResource<"department" | "roles" | "studentDetail">
])

const employeeScheduleFetcher = new EmployeeScheduleFetcher()
const consultantSchedules = ref<DeserializedEmployeeScheduleResource[]>([])
function fetchConsultantSchedules(selectedConsultant: DeserializedUserResource<"roles">) {
	employeeScheduleFetcher.list({
		"filter": {
			"day": "*",
			"employeeScheduleRange": "*",
			"existence": "exists",
			"user": selectedConsultant.id
		},
		"page": {
			"limit": 20,
			"offset": 0
		},
		"sort": [ "dayName" ]
	}).then(({ body }) => {
		const { "data": schedules } = body
		consultantSchedules.value = schedules
	})
}

const dateToday = ref(new Date())
const dateInNextMonth = jumpNextMonth(dateToday.value)
const dayIndex = dateToday.value.getDay()
const reorderedDays = [ ...DayValues.slice(dayIndex), ...DayValues.slice(0, dayIndex) ]

const chosenDay = ref("")
const customDate = ref("")
const isCustomDate = computed(() => chosenDay.value === "custom")
const selectableDays = computed(() => {
	const dates: Date[] = []
	if (consultantSchedules.value.length) {
		const consultantDays = makeUnique(consultantSchedules.value.map(schedule => schedule.dayName))

		consultantDays.sort((element1, element2) => {
			const element1Index = reorderedDays.indexOf(element1 as Day)
			const element2Index = reorderedDays.indexOf(element2 as Day)

			return Math.sign(element1Index - element2Index)
		})

		for (const day of consultantDays) {
			const dateCounter = new Date()
			const reorderedDayIndex = reorderedDays.indexOf(day)
			dateCounter.setDate(dateCounter.getDate() + reorderedDayIndex)

			dates.push(dateCounter)
		}
	}

	const actualSelectableDays = dates.map(date => {
		const previewDate = date.toDateString().split(" ")
		previewDate.shift()

		return {
			"label": `${DayValues[date.getDay()]} (${previewDate.join(" ")})`,
			"value": date.toJSON()
		}
	})
	actualSelectableDays.push({
		"label": "Custom...",
		"value": "custom"
	})


	return actualSelectableDays as OptionInfo[]
})

const chosenTime = ref("")
const selectableTimes = computed(() => {
	const availableTimes: OptionInfo[] = []
	const dayToDerive = isCustomDate.value && customDate.value
		? customDate.value
		: chosenDay.value

	if (consultantSchedules.value.length && dayToDerive) {
		const convertedDate = new Date(dayToDerive)
		const day = DayValues[convertedDate.getDay()]
		const schedulesByDay = consultantSchedules.value.filter(
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

				const comparableDate = new Date(chosenDay.value)
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
watch(chosenTime, () => {
	hasConflicts.value = false
})

const scheduledStartAt = computed(() => {
	const chosenDate = isCustomDate.value && customDate.value
		? new Date(customDate.value)
		: new Date(chosenDay.value)

	const timeObject = convertMinutesToTimeObject(Number(chosenTime.value))
	chosenDate.setHours(timeObject.hours)
	chosenDate.setMinutes(timeObject.minutes)
	chosenDate.setSeconds(0)
	chosenDate.setMilliseconds(0)

	return chosenDate.toJSON()
})


const isRequiredInfoCompleted = computed(
	() => Boolean(selectedConsultants.value.length)
		&& Boolean(addressConsultantAs.value)
		&& Boolean(consultantSchedules.value.length)
		&& Boolean(reason.value)
		&& Boolean(chosenTime.value)
)
function addConsultation(): void {
	const consultant = {
		"id": selectedConsultants.value[0]?.id,
		"type": "user"
	}

	const meta = {
		"doesAllowConflicts": forceCreate.value
	}

	fetcher().create({
		"actionTaken": null,
		"deletedAt": null,
		"finishedAt": null,
		"reason": reason.value,
		"scheduledStartAt": scheduledStartAt.value,
		"startedAt": null
	}, {
		"extraCreateDocumentProps": { meta },
		"extraDataFields": {
			"relationships": {
				"consultant": {
					"data": consultant
				},
				"consultantRole": {
					"data": {
						"id": String(addressConsultantAs.value),
						"type": "role"
					}
				},
				"participants": {
					"data": [
						...selectedConsulters.value.map(consulter => ({
							"id": consulter.id,
							"type": "user"
						})),
						consultant
					]
				}
			}
		}
	})
	.then(() => assignPath("/consultation"))
	.catch(() => {
		hasConflicts.value = true
	})
}

onMounted(() => {
	rawFetcher = new Fetcher()
})

watch(selectedConsultants, () => {
	if (selectedConsultants.value.length) {
		const [ selectedConsultant ] = selectedConsultants.value
		fetchConsultantSchedules(selectedConsultant)
	} else {
		consultantSchedules.value = []
	}
})
</script>
