<template>
	<SearchableChip
		v-model="slug"
		:header="header"
		:is-loaded="isLoaded"
		:text-field-label="textFieldLabel"
		:maximum-chips="maximumTags"
		:unselected-chips="otherTagChips"
		:selected-chips="selectedTagChips"
		@add-chip="addTag"
		@remove-chip="removeTag"/>
</template>

<style lang="scss">
</style>

<script setup lang="ts">
import { ref, computed, watch } from "vue"

import type { ChipData } from "$@/types/component"
import type { DeserializedTagResource } from "$/types/documents/tag"

import { DEFAULT_LIST_LIMIT } from "$/constants/numerical"
import { DEBOUNCED_WAIT_DURATION } from "$@/constants/time"

import Fetcher from "$@/fetchers/tag"
import debounce from "$@/helpers/debounce"

import SearchableChip from "@/helpers/filters/searchable_chip.vue"

const props = defineProps<{
	header: string,
	modelValue: DeserializedTagResource[],
	maximumTags: number,
	textFieldLabel: string
}>()

interface CustomEvents {
	(eventName: "update:modelValue", resource: DeserializedTagResource[]): void
}
const emit = defineEmits<CustomEvents>()

const slug = ref<string>("")
const otherTags = ref<DeserializedTagResource[]>([])
const otherTagChips = computed<ChipData[]>(() => otherTags.value.map(
	participant => ({
		"data": participant.name,
		"id": participant.id,
		"mayRemove": false
	})
))
const selectedTags = computed<DeserializedTagResource[]>({
	get(): DeserializedTagResource[] {
		return props.modelValue
	},
	set(newValue: DeserializedTagResource[]): void {
		emit("update:modelValue", newValue)
	}
})
const selectedTagChips = computed<ChipData[]>(() => selectedTags.value.map(
	participant => ({
		"data": participant.name,
		"id": participant.id,
		"mayRemove": true
	})
))

const isLoaded = ref(true)
const fetcher = new Fetcher()
function findMatchedTags() {
	isLoaded.value = false
	fetcher.list({
		"filter": {
			"existence": "exists",
			"mustHavePost": false,
			"slug": slug.value
		},
		"page": {
			"limit": DEFAULT_LIST_LIMIT,
			"offset": 0
		},
		"sort": [ "name" ]
	}).then(({ body }) => {
		otherTags.value = body.data.filter(candidate => {
			const isNotSelected = selectedTags.value.findIndex(selectedTag => {
				const doesMatchSelectedTag = candidate.id === selectedTag.id
				return doesMatchSelectedTag
			}) === -1

			return isNotSelected
		})
		isLoaded.value = true
	})
}
watch(slug, debounce(findMatchedTags, DEBOUNCED_WAIT_DURATION))

function removeTag(id: string): void {
	selectedTags.value = selectedTags.value.filter(user => {
		const doesNotMatchesID = user.id !== id
		return doesNotMatchesID
	})
}

function addTag(id: string): void {
	const foundTag = otherTags.value.find(user => {
		const doesMatchesID = user.id === id
		return doesMatchesID
	})

	if (foundTag) {
		selectedTags.value = [ ...selectedTags.value, foundTag ]
	}

	otherTags.value = []
}
</script>
