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
			<div class="consultor-fields" :class="consultorFieldsClasses">
				<SearchableChip
					v-model="selectedConsultors"
					:current-user="userProfileData"
					class="consultor required"
					header="Consultor"
					:maximum-participants="MAX_CONSULTORS"
					text-field-label="Type the employee to add"
					kind="reachable_employee"/>

				<div v-if="selectedConsultors.length" class="required">
					<SelectableOptionsField
						v-model="addressConsultorAs"
						class="consultor-roles"
						label="Address consultor as:"
						:options="consultorRoles"/>
				</div>
			</div>

			<SearchableChip
				v-model="selectedConsultees"
				:current-user="userProfileData"
				class="consultees"
				header="Consultee(s)"
				:maximum-participants="MAX_CONSULTEES"
				text-field-label="Type the students to add"
				kind="student"/>

			<div class="reason-and-urgency">
				<div class="required">
					<SelectableOptionsField
						v-model="chosenReason"
						class="reason"
						label="Kind of Reason: "
						placeholder="Choose your reason"
						:options="reasonOptions"/>
				</div>

				<label
					class="is-urgent-checkbox-container"
					for="is-urgent-checkbox">
					<input
						id="is-urgent-checkbox"
						v-model="isUrgent"
						type="checkbox"
						class="is-urgent-checkbox"/>
					This is an urgent concern.
				</label>
			</div>
			<ReceivedErrors v-if="receivedErrors.length" :received-errors="receivedErrors"/>
			<NonSensitiveTextField
				v-if="hasChosenOtherReason"
				v-model="otherReason"
				class="other-reason required"
				label="What are the other reasons(s)?"
				type="text"/>
			<Scheduler
				v-if="selectedConsultors.length"
				v-model:chosen-day="chosenDay"
				v-model:chosen-time="chosenTime"
				:consultor-schedules="consultorSchedules"
				:is-urgent="isUrgent"
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
	@import "@styles/variables.scss";

	.btn {
		border: none;
		color: white;
		padding: 10px;
		text-align: center;
		text-decoration: none;
		display: inline-block;
		font-size: 16px;
	}

	@screen md {
		.overlay .content {
			margin: 10% 0 !important;
			max-height: 100vh !important;
		}
	}

	.has-selected-consultor .selectable {
		@apply flex-col items-start;

		@screen md {
			@apply ml-4;
		}

		select {
			@screen md {
				@apply ml-0 mt-2;
			}
		}
	}

	.selectable {
		@apply flex md:items-center;

		select {
			@apply p-2;
			@apply rounded-md;
			@apply dark:bg-transparent dark:text-white;

			option {
				@apply dark:bg-dark-200 dark:text-white;
			}
		}

		max-width: initial !important;
	}

	.required{
		&::before {
			@apply text-xs;
			@apply mb-2;

			display:block;
			color: $color-primary;
			content:"* required";
		}
	}
</style>

<style scoped lang="scss">
	@import "@styles/btn.scss";
	@import "@styles/variables.scss";
	@import "@styles/status_messages.scss";

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

	.consultor-fields {
		@apply mb-4;
		@apply flex flex-col;

		&.has-selected-consultor {
			@screen md {
				@apply mb-0;
				@apply flex-row justify-start;
			}
		}
	}

	.reason-and-urgency {
		@apply flex flex-row flex-wrap items-center justify-between;

		.is-urgent-checkbox-container {
			@apply mt-4;

			display: block;
		}
	}

	.schedule-selector {
		@apply mt-5;
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
import convertTimeToMinutes from "$/time/convert_time_to_minutes"
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

const MAX_CONSULTORS = 1
const selectedConsultors = ref<DeserializedUserResource<"roles">[]>([])
const consultorRoles = computed(() => {
	const roleIDs: string[] = []
	const labels: string[] = []

	if (selectedConsultors.value.length) {
		const [ consultor ] = selectedConsultors.value
		consultor.roles.data.forEach(role => roleIDs.push(String(role.id)))
		consultor.roles.data.forEach(role => labels.push(role.name))
	}

	return makeOptionInfo(roleIDs, labels) as OptionInfo[]
})
const addressConsultorAs = ref("")
const consultorFieldsClasses = computed(() => ({
	"has-selected-consultor": selectedConsultors.value.length
}))

const MAX_CONSULTEES = 5
const selectedConsultees = ref<DeserializedUserResource<"studentDetail">[]>([
	userProfileData as DeserializedUserResource<"department" | "roles" | "studentDetail">
])

const employeeScheduleFetcher = new EmployeeScheduleFetcher()
const consultorSchedules = ref<DeserializedEmployeeScheduleListDocument>({
	"data": [],
	"meta": {
		"count": 0
	}
})
async function fetchConsultorSchedules(selectedConsultor: DeserializedUserResource<"roles">) {
	await loadRemainingResource(consultorSchedules, employeeScheduleFetcher, () => ({
		"filter": {
			"day": "*",
			"employeeScheduleRange": "*",
			"existence": "exists",
			"user": selectedConsultor.id
		},
		"page": {
			"limit": DEFAULT_LIST_LIMIT,
			"offset": consultorSchedules.value.data.length
		},
		"sort": [ "dayName" ]
	}))
}
watch(selectedConsultors, () => {
	if (selectedConsultors.value.length) {
		const [ selectedConsultor ] = selectedConsultors.value
		fetchConsultorSchedules(selectedConsultor)
	} else {
		consultorSchedules.value = {
			"data": [],
			"meta": {
				"count": 0
			}
		}
	}
})

const chosenDay = ref<string>("")
const chosenTime = ref<string>("")

const isUrgent = ref(false)
const scheduledStartAt = computed<string>(() => {
	const chosenDate = new Date(chosenDay.value)
	const CUSTOM_MILLISECONDS_IF_URGENT = 16

	const timeObject = convertMinutesToTimeObject(Number(chosenTime.value))
	chosenDate.setHours(timeObject.hours)
	chosenDate.setMinutes(timeObject.minutes)
	chosenDate.setSeconds(0)
	if (isUrgent.value) chosenDate.setMilliseconds(CUSTOM_MILLISECONDS_IF_URGENT)
	else chosenDate.setMilliseconds(0)

	return chosenDate.toJSON()
})
watch(isUrgent, newValue => {
	if (newValue) {
		const currentDate = new Date()
		chosenTime.value
		= String(convertTimeToMinutes(`${currentDate.getHours()}:${currentDate.getMinutes()}`))

		chosenDay.value = currentDate.toJSON()
	}
})


const isRequiredInfoCompleted = computed(
	() => Boolean(selectedConsultors.value.length)
		&& Boolean(addressConsultorAs.value)
		&& Boolean(consultorSchedules.value.data.length)
		&& Boolean(reason.value)
		&& Boolean(chosenTime.value || isUrgent.value)
)
function addConsultation(): void {
	const consultor = {
		"id": selectedConsultors.value[0]?.id,
		"type": "user"
	}

	const meta = {
		"doesAllowConflicts": forceCreate.value,
		"mustForceStart": isUrgent.value
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
				"consultor": {
					"data": consultor
				},
				"consultorRole": {
					"data": {
						"id": String(addressConsultorAs.value),
						"type": "role"
					}
				},
				"participants": {
					"data": [
						...selectedConsultees.value.map(consultee => ({
							"id": consultee.id,
							"type": "user"
						})),
						consultor
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
