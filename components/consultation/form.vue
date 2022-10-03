<template>
	<!-- TODO: Refactor all WindiCSS inline classes using @apply directive -->
	<Overlay :is-shown="isShown" @close="emitClose">
		<template #header>
			<h1>Enter the consultation details</h1>
		</template>
		<template #default>
			<SearchableChip
				v-model="selectedConsultants"
				class="consultant"
				header="Consultant"
				:maximum-participants="MAX_CONSULTANTS"
				text-field-label="Type the employee to add"
				kind="reachable_employee"/>
			<SelectableOptionsField
				v-if="selectedConsultants.length"
				v-model="addressConsultantAs"
				class="consultant-roles"
				label="Address consultant as:"
				:options="consultantRoles"/>
			<SearchableChip
				v-model="selectedConsulters"
				:current-user-id="userProfileData.id"
				class="consulters"
				header="Consulters"
				:maximum-participants="MAX_CONSULTERS"
				text-field-label="Type the students to add"
				kind="student"/>
			<SelectableOptionsField
				v-model="chosenReason"
				class="reason"
				label="Kind of Reason: "
				placeholder="Choose your reason"
				:options="reasonOptions"/>
			<NonSensitiveTextField
				v-if="hasChosenOtherReason"
				v-model="otherReason"
				class="other-reason"
				label="What are the other reasons(s)?"
				type="text"/>
			<div
				v-if="selectedConsultants.length"
				class="schedule-selector mt-5">
				<div
					v-if="consultantSchedules.length"
					class="consultant-has-schedules">
					<p>Please select the day and time from the consultant's available schedules</p>
					<SelectableOptionsField
						v-model="selectedDay"
						class="selectable-day"
						label="Day:"
						:options="selectableDays"/>
					<SelectableOptionsField
						v-if="selectedDay"
						v-model="selectedTime"
						class="selectable-time"
						label="Time:"
						:options="selectableTimes"/>
				</div>

				<div v-else class="consultant-no-schedules">
					<p class="text-red-500">
						This consultant has not set any schedules yet.
					</p>
				</div>
			</div>

			<div class="signature-message text-xs mt-5">
				By submitting, your signatures will be applied on the printable consultation form.
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
				:disabled="!isConsultantAvailable"
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
	max-width: initial !important;
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
import SearchableChip from "@/consultation/form/searchable_chip.vue"
import generateTimeRange from "@/helpers/schedule_picker/generate_time_range"
import convertMinutesToTimeObject from "%/helpers/convert_minutes_to_time_object"
import convertTimeObjectToTimeString from "@/helpers/schedule_picker/convert_time_object_to_time_string"

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
const doesAllowConflicts = ref<boolean>(true)

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
			"existence": "*",
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

const selectedDay = ref("")
const selectableDays = computed(() => {
	const days: string[] = []
	if (consultantSchedules.value.length) {
		consultantSchedules.value.map(schedule => days.push(schedule.dayName))
		days.sort((element1, element2) => {
			const element1Index = DayValues.indexOf(element1 as Day)
			const element2Index = DayValues.indexOf(element2 as Day)

			return Math.sign(element1Index - element2Index)
		})
	}
	return makeOptionInfo(makeUnique(days)) as OptionInfo[]
})

const selectedTime = ref("")
const selectableTimes = computed(() => {
	const availableTimes: OptionInfo[] = []
	if (consultantSchedules.value.length && selectedDay.value) {
		const schedulesByDay = consultantSchedules.value.filter(
			schedule => schedule.dayName === selectedDay.value
		)
		schedulesByDay.forEach(schedule => {
			const times = generateTimeRange({
				"end": schedule.scheduleEnd,
				"start": schedule.scheduleStart
			})

			times.forEach(time => {
				const timeObject = convertMinutesToTimeObject(time)
				const midday = getTimePart(time, "midday")
				const label = `${convertTimeObjectToTimeString(timeObject)} ${midday}`

				availableTimes.push({
					label,
					"value": String(time)
				})
			})
		})
	}

	return availableTimes
})

const isConsultantAvailable = computed(
	() => Boolean(selectedConsultants.value.length) && Boolean(consultantSchedules.value.length)
)
function addConsultation(): void {
	const consultant = {
		"id": selectedConsultants.value[0]?.id,
		"type": "user"
	}

	const meta = {
		"doesAllowConflicts": doesAllowConflicts.value
	}

	fetcher().create({
		"actionTaken": null,
		"deletedAt": null,
		"finishedAt": null,
		"reason": reason.value,
		// TODO: Make the schedule selector
		"scheduledStartAt": new Date().toJSON(),
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
}

onMounted(() => {
	rawFetcher = new Fetcher()
})

watch(selectedConsultants, () => {
	const [ selectedConsultant ] = selectedConsultants.value
	fetchConsultantSchedules(selectedConsultant)
})
</script>
