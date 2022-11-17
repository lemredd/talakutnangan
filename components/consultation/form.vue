<template>
	<Overlay :is-shown="isShown" @close="emitClose">
		<template #header>
			<h1>Enter the consultation details</h1>
		</template>

		<template #default>
			<ReceivedErrors v-if="receivedErrors.length" :received-errors="receivedErrors"/>
			<ReceivedSuccessMessages
				v-if="successMessages.length"
				:received-success-messages="successMessages"/>
			<p class="status-messages warning">
				* Names are case-sensitive.
			</p>
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
			<ReceivedErrors v-if="receivedErrors.length" :received-errors="receivedErrors"/>
			<NonSensitiveTextField
				v-if="hasChosenOtherReason"
				v-model="otherReason"
				class="other-reason required"
				label="What are the other reasons(s)?"
				type="text"/>
			<Scheduler
				v-model:chosen-day="chosenDay"
				v-model:chosen-time="chosenTime"
				:consultant-schedules="consultantSchedules"
				class="schedule-selector"/>

			<div class="may-not-start-right-away-msg">
				<label>
					<input
						id="checkbox"
						v-model="forceCreate"
						type="checkbox"/>
					<span>
						I understand that this consultation may not
						start right away on the specified schedule above.
					</span>
				</label>
			</div>
			<p v-if="hasConflicts">
				Other students have schedule with consultant on the same day and same time. Please
				change the time.
			</p>

			<div class="signature-message">
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
	@import "@styles/variables.scss";
	@import "@styles/status_messages.scss";

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
			@apply p-2;
			@apply dark:bg-transparent dark:text-white;

			option {
				@apply dark:bg-dark-200 dark:text-white;
			}
		}

		max-width: initial !important;
	}

	.consultation-no-schedules{
		@apply text-red-500;
	}

	.signature-message {
		@apply text-xs;
	}

	.may-not-start-right-away-msg {
		@apply my-8 text-sm;
	}

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
import { ref, computed, inject, watch } from "vue"

import type { PageContext } from "$/types/renderer"
import type { OptionInfo } from "$@/types/component"
import type { DeserializedUserResource } from "$/types/documents/user"
import type { DeserializedEmployeeScheduleListDocument } from "$/types/documents/employee_schedule"

import { reasons } from "$@/constants/options"
import { DEFAULT_LIST_LIMIT } from "$/constants/numerical"

import Fetcher from "$@/fetchers/consultation"
import EmployeeScheduleFetcher from "$@/fetchers/employee_schedule"

import Overlay from "@/helpers/overlay.vue"
import assignPath from "$@/external/assign_path"
import makeOptionInfo from "$@/helpers/make_option_info"
import fillSuccessMessages from "$@/helpers/fill_success_messages"
import loadRemainingResource from "$@/helpers/load_remaining_resource"
import extractAllErrorDetails from "$@/helpers/extract_all_error_details"
import convertMinutesToTimeObject from "%/helpers/convert_minutes_to_time_object"

import Scheduler from "./helpers/scheduler.vue"
import NonSensitiveTextField from "@/fields/non-sensitive_text.vue"
import SearchableChip from "@/consultation/form/searchable_chip.vue"
import SelectableOptionsField from "@/fields/selectable_options.vue"
import ReceivedErrors from "@/helpers/message_handlers/received_errors.vue"
import ReceivedSuccessMessages from "@/helpers/message_handlers/received_success_messages.vue"

const { isShown } = defineProps<{ isShown: boolean }>()

const { pageProps } = inject("pageContext") as PageContext<"deserialized", "consultations">
const { "userProfile": { "data": userProfileData } } = pageProps

const fetcher = new Fetcher()
const receivedErrors = ref<string[]>([])
const successMessages = ref<string[]>([])

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
const consultantSchedules = ref<DeserializedEmployeeScheduleListDocument>({
	"data": [],
	"meta": {
		"count": 0
	}
})
async function fetchConsultantSchedules(selectedConsultant: DeserializedUserResource<"roles">) {
	await loadRemainingResource(consultantSchedules, employeeScheduleFetcher, () => ({
		"filter": {
			"day": "*",
			"employeeScheduleRange": "*",
			"existence": "exists",
			"user": selectedConsultant.id
		},
		"page": {
			"limit": DEFAULT_LIST_LIMIT,
			"offset": consultantSchedules.value.data.length
		},
		"sort": [ "dayName" ]
	}))
}
watch(selectedConsultants, () => {
	if (selectedConsultants.value.length) {
		const [ selectedConsultant ] = selectedConsultants.value
		fetchConsultantSchedules(selectedConsultant)
	} else {
		consultantSchedules.value = {
			"data": [],
			"meta": {
				"count": 0
			}
		}
	}
})

const chosenDay = ref<string>("")
const chosenTime = ref<string>("")

const scheduledStartAt = computed<string>(() => {
	const chosenDate = new Date(chosenDay.value)

	const timeObject = convertMinutesToTimeObject(Number(chosenTime.value))
	chosenDate.setHours(timeObject.hours)
	chosenDate.setMinutes(timeObject.minutes)
	chosenDate.setSeconds(0)
	chosenDate.setMilliseconds(0)

	return chosenDate.toJSON()
})
watch(scheduledStartAt, () => {
	hasConflicts.value = false
})

const isRequiredInfoCompleted = computed(
	() => Boolean(selectedConsultants.value.length)
		&& Boolean(addressConsultantAs.value)
		&& Boolean(consultantSchedules.value.data.length)
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

	fetcher.create({
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
	.then(() => {
		fillSuccessMessages(receivedErrors, successMessages)
		assignPath("/consultation")
	})
	.catch(responseWithErrors => extractAllErrorDetails(responseWithErrors, receivedErrors))
}
</script>
