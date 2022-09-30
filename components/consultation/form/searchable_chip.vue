<template>
	<!-- TODO: Refactor all WindiCSS inline classes using @apply directive -->
	<div class="field pb-5">
		<h2 class="text-lg uppercase">
			{{ header }}
		</h2>
		<div
			v-for="participant in selectedParticipants"
			:key="participant.id"
			class="chip selected-participants">
			<span>
				{{ participant.name }}
			</span>
			<span
				id="close-btn"
				class="material-icons"
				@click="removeParticipant">
				close
			</span>
		</div>
		<NonSensitiveTextField
			v-if="mayAddOtherParticipants"
			v-model="slug"
			:label="textFieldLabel"
			type="text"/>
		<div
			v-for="participant in otherParticipants"
			:key="participant.id"
			class="chip other-participants cursor-pointer hover:bg-gray-300"
			@click="addParticipant">
			{{ participant.name }}
		</div>
	</div>
</template>

<style lang="scss">
@import "@styles/btn.scss";

.chip {
	@apply inline-flex items-center text-sm;

	margin:5px;
	border-radius: 25px;
	padding: 0 15px;

	height: 30px;

	color: black;
	background-color:#f1f1f1;
}

#close-btn {
  padding-left: 10px;
  color: #888;
  font-weight: bold;
  float: right;
  font-size: 20px;
  cursor: pointer;
}

#close-btn:hover {
  color: #000;
}
</style>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue"

import type { UserKind } from "$/types/database"
import type { DeserializedUserResource } from "$/types/documents/user"

import { DEBOUNCED_WAIT_DURATION } from "$@/constants/time"

import Fetcher from "$@/fetchers/user"
import debounce from "$@/helpers/debounce"

import NonSensitiveTextField from "@/fields/non-sensitive_text.vue"
import RequestEnvironment from "$/singletons/request_environment"

const props = defineProps<{
	header: string,
	modelValue: DeserializedUserResource[],
	maximumParticipants: number,
	textFieldLabel: string,
	kind: UserKind
}>()

interface CustomEvents {
	(eventName: "update:modelValue", resource: DeserializedUserResource[]): void
}
const emit = defineEmits<CustomEvents>()

const otherParticipants = ref<DeserializedUserResource[]>([])
const slug = ref<string>("")
const selectedParticipants = computed<DeserializedUserResource[]>({
	get(): DeserializedUserResource[] {
		return props.modelValue
	},
	set(newValue: DeserializedUserResource[]): void {
		emit("update:modelValue", newValue)
	}
})
const mayAddOtherParticipants = computed<boolean>(
	() => props.modelValue.length < props.maximumParticipants
)

let rawFetcher: Fetcher|null = null

function fetcher(): Fetcher {
	if (rawFetcher === null) throw new Error("User cannot be processed yet")

	return rawFetcher
}

function findMatchedUsers() {
	fetcher().list({
		"filter": {
			"department": "*",
			"existence": "exists",
			"kind": props.kind,
			"role": "*",
			"slug": slug.value
		},
		"page": {
			"limit": 10,
			"offset": 0
		},
		"sort": [ "name" ]
	}).then(({ body }) => {
		otherParticipants.value = body.data.filter(candidate => {
			const isNotSelected = selectedParticipants.value.findIndex(selectedParticipant => {
				const doesMatchSelectedParticipant = candidate.id === selectedParticipant.id
				return doesMatchSelectedParticipant
			}) === -1

			return isNotSelected
		})
	})
}

watch(slug, debounce(findMatchedUsers, DEBOUNCED_WAIT_DURATION))

function removeParticipant(event: Event): void {
	const { target } = event
	const castTarget = target as HTMLSpanElement
	const button = castTarget.previousElementSibling as HTMLButtonElement
	const text = RequestEnvironment.isOnTest
		? button.innerHTML
		: button.innerText

	selectedParticipants.value = selectedParticipants.value.filter(user => {
		const isNameMatching = text.includes(user.name)
		return !isNameMatching
	})
}

function addParticipant(event: Event): void {
	const target = event.target as HTMLDivElement
	const participantName = RequestEnvironment.isOnTest
		? target.innerHTML
		: target.innerText

	const foundParticipant = otherParticipants.value.find(user => {
		const isNameMatching = participantName.includes(user.name)
		return isNameMatching
	})

	if (foundParticipant) {
		selectedParticipants.value = [ ...selectedParticipants.value, foundParticipant ]
	}

	otherParticipants.value = []
}
Fetcher.initialize("/api")
onMounted(() => {
	rawFetcher = new Fetcher()
})
</script>
