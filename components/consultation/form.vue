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
			<SearchableChip
				v-model="selectedConsulters"
				class="consulters"
				header="Consulters"
				:maximum-participants="MAX_ADDITIONAL_CONSULTERS"
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
				label="What are the other reasons(s)?"
				type="text"/>

			<div class="signature-message text-xs mt-5">
				By submitting, you are granting permission to use the participants' signatures.
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
				class="btn btn-primary"
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

.reason {
	@apply flex justify-between;
	max-width: initial !important;
}
</style>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue"

import type { DeserializedUserResource } from "$/types/documents/user"

import Fetcher from "$@/fetchers/consultation"

import Overlay from "@/helpers/overlay.vue"
import NonSensitiveTextField from "@/fields/non-sensitive_text.vue"
import SelectableOptionsField from "@/fields/selectable_options.vue"
import SearchableChip from "@/consultation/form/searchable_chip.vue"

const { isShown } = defineProps<{ isShown: boolean }>()

let rawFetcher: Fetcher|null = null

function fetcher(): Fetcher {
	if (rawFetcher === null) throw new Error("Consultation cannot be processed yet")

	return rawFetcher
}

const reasons = [ "Grade-related", "Task-related", "Exam-related", "Others" ] as const
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

const MAX_ADDITIONAL_CONSULTERS = 4
const selectedConsulters = ref<DeserializedUserResource<"studentDetail">[]>([])

function addConsultation(): void {
	const consultant = {
		"id": selectedConsultants.value[0]?.id,
		"type": "user"
	}

	const unusedMeta = {
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
		"extraDataFields": {
			"relationships": {
				"consultant": {
					"data": consultant
				},
				"consultantRole": {
					"data": {
						"id": "",
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
}

onMounted(() => {
	rawFetcher = new Fetcher()
})
</script>
