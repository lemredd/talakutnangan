<template>
	<div class="search-bar">
		<!-- TODO: separate component from textual_field -->
		<input
			type="text"
			id="search-filter"
			class="search-filter"
			:value="textFilter"
			@input="updateTextFilter">
		<button class="material-icons">search</button>
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
import { PossibleResources } from "$@/types/independent";
import { inject, Ref, ref } from "vue"

const resource = inject("resource") as Ref<PossibleResources[]>

const { textFilter } = defineProps<{
	textFilter: string
}>()
const emit = defineEmits<{
	(e: "update:textFilter", textFilter: string ): void
}>()

function updateTextFilter(event: Event) {
	const input = event.target as HTMLInputElement
	emit("update:textFilter", input.value)
}
</script>
