<template>
	<Overlay :is-shown="isShown">
		<template #header>
			<h1>Enter the consultation details</h1>
		</template>
		<template #default>
			<div class="consultant p-5">
				<h2>Consultants</h2>
				<div
					v-for="consultant in selectedConsultants"
					:key="consultant.id"
					class="chip-consultants">
					{{ consultant.name }}
					<span class="closebtn" @click="removeConsultant">
						&times;
					</span>
				</div>
				<NonSensitiveTextField
					v-if="mayAddConsultants"
					v-model="consultantSlug"
					label="Type the employee to add"
					type="text"/>
			</div>
			<div class="consulters p-5">
				<h2>Consulters</h2>
				<div
					v-for="consulter in selectedConsulters"
					:key="consulter.id"
					class="chip-consulters">
					{{ consulter.name }}
					<span class="closebtn" @click="removeConsulter">
						&times;
					</span>
				</div>
				<NonSensitiveTextField
					v-if="mayAddConsulters"
					v-model="consulterSlug"
					label="Type the students to add"
					type="text"/>
			</div>
			<form>
				<SelectableOptionsField
					v-model="chosenReason"
					label="Kind of Reason: "
					placeholder="Choose your reason"
					:options="reasonOptions"/>
				<NonSensitiveTextField
					v-if="hasChosenOtherReason"
					v-model="otherReason"
					label="What are the other reasons(s)?"
					type="text"/>
			</form>
		</template>
		<template #footer>
			<button
				class="btn btn-back"
				type="button"
				@click="emitClose">
				Back
			</button>
			<button class="btn btn-primary" type="button">
				Submit
			</button>
		</template>
	</Overlay>
</template>

<style lang="scss">
@import "@styles/btn.scss";

.chip-consultant, .chip-consulters {
  display: inline-block;
  padding: 0 15px;
  margin:5px;
  height: 30px;
  font-size: 18px;
  color: black;
  line-height: 30px;
  border-radius: 25px;
  background-color:#f1f1f1;
}

.closebtn {
  padding-left: 10px;
  color: #888;
  font-weight: bold;
  float: right;
  font-size: 20px;
  cursor: pointer;
}

.closebtn:hover {
  color: #000;
}

.btn{
  border: none;
  border-radius: 5px;
  color: white;
  padding: 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
}

</style>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue"

import type { UserKind } from "$/types/database"
import type { DeserializedUserResource } from "$/types/documents/user"

import { DEBOUNCED_WAIT_DURATION } from "$@/constants/time"

import Fetcher from "$@/fetchers/user"
import debounce from "$@/helpers/debounce"

import Overlay from "@/helpers/overlay.vue"
import NonSensitiveTextField from "@/fields/non-sensitive_text.vue"
import SelectableOptionsField from "@/fields/selectable_options.vue"


const { isShown } = defineProps<{ isShown: boolean }>()

let rawFetcher: Fetcher|null = null

function fetcher(): Fetcher {
	if (rawFetcher === null) throw new Error("User cannot be processed yet")

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
// TODO: Use the value below to create the consultation
const unusedReason = computed<string>(() => {
	if (hasChosenOtherReason.value) return otherReason.value
	return chosenReason.value
})

function findMatchedUsers(kind: UserKind, slug: string) {
	fetcher().list({
		"filter": {
			"department": "*",
			"existence": "exists",
			kind,
			"role": "*",
			slug
		},
		"page": {
			"limit": 10,
			"offset": 0
		},
		"sort": [ "name" ]
	})
}

const MAX_CONSULTANTS = 1
const consultantSlug = ref<string>("")
const findMatchedConsultants = debounce(() => {
	findMatchedUsers("reachable_employee", consultantSlug.value)
}, DEBOUNCED_WAIT_DURATION)
const selectedConsultants = ref<DeserializedUserResource<"roles">[]>([])
const mayAddConsultants = computed<boolean>(
	() => selectedConsultants.value.length < MAX_CONSULTANTS
)
const consultants = ref<DeserializedUserResource<"roles">[]>([])

watch(consultantSlug, () => findMatchedConsultants())

const MAX_CONSULTERS = 5
const consulterSlug = ref<string>("")
const findMatchedConsulters = debounce(() => {
	findMatchedUsers("student", consulterSlug.value)
}, DEBOUNCED_WAIT_DURATION)
const selectedConsulters = ref<DeserializedUserResource<"studentDetail">[]>([])
const mayAddConsulters = computed<boolean>(() => selectedConsulters.value.length < MAX_CONSULTERS)
const consulters = ref<DeserializedUserResource<"studentDetail">[]>([])

watch(consulterSlug, () => findMatchedConsulters())

function removeConsultant(event: Event): void {
	const { target } = event
	const castTarget = target as HTMLButtonElement
	const text = castTarget.innerHTML

	consultants.value = consultants.value.filter(user => {
		const foundNameIndex = text.indexOf(user.data.name)
		return foundNameIndex === -1
	})
}

function removeConsulter(event: Event): void {
	const { target } = event
	const castTarget = target as HTMLButtonElement
	const text = castTarget.innerHTML

	consulters.value = consulters.value.filter(user => {
		const foundNameIndex = text.indexOf(user.data.name)
		return foundNameIndex === -1
	})
}

onMounted(() => {
	rawFetcher = new Fetcher()
})
</script>
