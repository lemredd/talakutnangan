<template>
	<SearchableChip
		v-model="slug"
		:header="header"
		:is-loaded="isLoaded"
		:text-field-label="textFieldLabel"
		:maximum-chips="maximumParticipants"
		:unselected-chips="otherParticipantChips"
		:selected-chips="selectedParticipantChips"
		@add-chip="addParticipant"
		@remove-chip="removeParticipant"/>
</template>

<style lang="scss">
</style>

<script setup lang="ts">
import { ref, computed, watch } from "vue"

import type { UserKind } from "$/types/database"
import type { ChipData } from "$@/types/component"
import type { DeserializedUserResource } from "$/types/documents/user"

import { DEFAULT_LIST_LIMIT } from "$/constants/numerical"
import { DEBOUNCED_WAIT_DURATION } from "$@/constants/time"

import Fetcher from "$@/fetchers/user"
import debounce from "$@/helpers/debounce"

import SearchableChip from "@/helpers/filters/searchable_chip.vue"

const props = defineProps<{
	currentUser: DeserializedUserResource
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

const slug = ref<string>("")
const otherParticipants = ref<DeserializedUserResource[]>([])
const otherParticipantChips = computed<ChipData[]>(() => otherParticipants.value.map(
	participant => ({
		"data": participant.name,
		"id": participant.id,
		"mayRemove": false
	})
))
const selectedParticipants = computed<DeserializedUserResource[]>({
	get(): DeserializedUserResource[] {
		return props.modelValue
	},
	set(newValue: DeserializedUserResource[]): void {
		emit("update:modelValue", newValue)
	}
})
const selectedParticipantChips = computed<ChipData[]>(() => selectedParticipants.value.map(
	participant => ({
		"data": participant.name,
		"id": participant.id,
		"mayRemove": participant.id !== props.currentUser.id
	})
))

const isLoaded = ref(true)
const fetcher = new Fetcher()
function findMatchedUsers() {
	isLoaded.value = false
	fetcher.list({
		"filter": {
			"department": "*",
			"existence": "exists",
			"kind": props.kind,
			"role": "*",
			"slug": slug.value
		},
		"page": {
			"limit": DEFAULT_LIST_LIMIT,
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
	isLoaded.value = true
}

watch(slug, debounce(findMatchedUsers, DEBOUNCED_WAIT_DURATION))

function removeParticipant(id: string): void {
	selectedParticipants.value = selectedParticipants.value.filter(user => {
		const doesIDMatches = user.id !== id
		return !doesIDMatches
	})
}

function addParticipant(id: string): void {
	const foundParticipant = otherParticipants.value.find(user => {
		const doesIDMatches = user.id !== id
		return doesIDMatches
	})

	if (foundParticipant) {
		selectedParticipants.value = [ ...selectedParticipants.value, foundParticipant ]
	}

	otherParticipants.value = []
}
</script>
