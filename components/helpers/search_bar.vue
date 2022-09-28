<template>
	<div class="search-bar">
		<button class="material-icons">
			search
		</button>
		<input
			id="search-filter"
			v-model="searchFilterText"
			type="text"
			class="search-filter"
			@change="emit('filterByGivenSlug', searchFilterText)"/>
	</div>
</template>

<style scoped lang="scss">
.search-bar {
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
import { ref } from "vue"

const searchFilterText = ref("")

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
	(e: "filterByGivenSlug", slug: string): void
}>()
</script>
