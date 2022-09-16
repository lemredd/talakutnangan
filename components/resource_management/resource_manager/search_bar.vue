<template>
	<div class="search-bar">
		<input
			id="search-filter"
			v-model="searchFilterText"
			type="text"
			class="search-filter"/>
		<button class="material-icons">
			search
		</button>
	</div>
</template>

<style scoped lang="scss">
.search-bar {
	margin-bottom: 1em;
	padding: 0.5em 1em;

	.search-filter {
		@apply border-b-gray-900;

		width: 100%;
		background-color: transparent;

		&:focus {
			outline: none;
		}
	}
}
</style>

<script setup lang = ts>
import { PossibleResources } from "$@/types/independent"
import { computed, onUpdated, ref } from "vue"

const { resource } = defineProps<{
	resource: PossibleResources[]
}>()
const searchFilterText = ref("")

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
	(e: "filterResourceBySearch", filteredResource: PossibleResources[]): void
}>()

const filteredList = computed(() => {
	const filteredBySearchResult = resource.filter((resourceToFilter: PossibleResources) => {
		let name = ""

		if (resourceToFilter.type === "department") name = resourceToFilter.fullName
		// eslint-disable-next-line prefer-destructuring
		else name = resourceToFilter.name

		return name.toLowerCase().includes(searchFilterText.value.toLowerCase())
	})

	return filteredBySearchResult
})


onUpdated(() => {
	emit("filterResourceBySearch", filteredList.value)
})
</script>
