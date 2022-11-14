<template>
	<Overlay
		:is-shown="isShown"
		class="action-taken"
		@close="hideOverlay">
		<template #header>
			Reschedule this consultation?
		</template>

		<template #default>
			<Scheduler
				v-model:chosen-day="chosenDay"
				v-model:chosen-time="chosenTime"
				:consultant-schedules="consultantSchedules"/>
		</template>

		<template #footer>
			<button
				class="reschedule-btn btn btn-primary"
				@click="rescheduleConsultation">
				submit
			</button>
		</template>
	</Overlay>
</template>

<style scoped lang="scss">
</style>

<script setup lang="ts">
import { computed, inject, onMounted, ref } from "vue"

import type { PageContext } from "$/types/renderer"
import type { DeserializedUserDocument } from "$/types/documents/user"
import type { DeserializedEmployeeScheduleListDocument } from "$/types/documents/employee_schedule"

import { DEFAULT_LIST_LIMIT } from "$/constants/numerical"

import Fetcher from "$@/fetchers/consultation"
import EmployeeScheduleFetcher from "$@/fetchers/employee_schedule"
import convertMinutesToTimeObject from "%/helpers/convert_minutes_to_time_object"

import Overlay from "@/helpers/overlay.vue"
import Scheduler from "@/consultation/helpers/scheduler.vue"
import loadRemainingResource from "$@/helpers/load_remaining_resource"

const pageContext = inject("pageContext") as PageContext<"deserialized", "consultation">
const { pageProps } = pageContext
type DefinedProps = {
	isShown: boolean
}
type CustomEvents = {
	(event: "hide"): void
	(event: "rescheduleConsultation"): void
}
defineProps<DefinedProps>()
const emit = defineEmits<CustomEvents>()

function hideOverlay() {
	emit("hide")
}

const { consultation } = pageProps
const employeeScheduleFetcher = new EmployeeScheduleFetcher()
const chosenDay = ref("")
const chosenTime = ref("")
const consultantSchedules = ref<DeserializedEmployeeScheduleListDocument>({
	"data": [],
	"meta": {
		"count": 0
	}
})
function fetchConsultantSchedules() {
	const consultant = consultation.data.consultant as DeserializedUserDocument
	loadRemainingResource(consultantSchedules, employeeScheduleFetcher, () => ({
		"filter": {
			"day": "*",
			"employeeScheduleRange": "*",
			"existence": "exists",
			"user": consultant?.data.id
		},
		"page": {
			"limit": DEFAULT_LIST_LIMIT,
			"offset": 0
		},
		"sort": [ "dayName" ]
	}), {
		"mayContinue": () => Promise.resolve(false)
	})
}

const scheduledStartAt = computed(() => {
	const chosenDate = new Date(chosenDay.value)

	if (chosenTime.value) {
		const timeObject = convertMinutesToTimeObject(Number(chosenTime.value))
		chosenDate.setHours(timeObject.hours)
		chosenDate.setMinutes(timeObject.minutes)
		chosenDate.setSeconds(0)
		chosenDate.setMilliseconds(0)
	}

	return chosenDate.toJSON()
})
const fetcher = new Fetcher()
function rescheduleConsultation() {
	fetcher.update(consultation.data.id, {
		"actionTaken": null,
		"deletedAt": null,
		"finishedAt": null,
		"reason": consultation.data.reason,
		"scheduledStartAt": scheduledStartAt.value,
		"startedAt": null
	}, {
		"extraDataFields": {
			"relationships": {
				"consultant": {
					"data": consultation.data.consultant?.data
				},
				"consultantRole": {
					"data": {
						"id": consultation.data.consultant?.data.id as string,
						"type": "role"
					}
				}
			}
		},
		"extraUpdateDocumentProps": {
			"meta": {
				"doesAllowConflicts": true
			}
		}
	})
}

onMounted(() => {
	fetchConsultantSchedules()
})
</script>
