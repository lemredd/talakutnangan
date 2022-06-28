<template>
<div class="dropdown-filter">
	<label for="select-filter">{{ filterLabel }}: </label>
	<select
		@input="emitUpdatedFilter"
		:value="filter"
		id="select-filter"
		class="select-filter">
		<option selected value="all">All</option>
		<option v-for="filterItem in filterList" :value="filterItem">{{ filterItem }}</option>
	</select>
</div>
</template>

<style scoped lang="scss">
.dropdown-filter {
	@apply grid grid-cols-2 gap-2 sm:justify-self-end;

	label {
		@apply sm:justify-self-end self-center;
	}

	.select-filter {
		@apply dark:bg-dark-300 bg-gray-300;
		position: relative;
	}
}
</style>

<script setup lang="ts">import { computed, inject } from 'vue'
import { ManagerKind } from '../types'

const { filterList, filter } = defineProps<{
	filterList: string[],
	filter: string
}>()
const emit = defineEmits<{
	(e: "update:filter", updatedFilter: string): void
}>()

const managerKind = inject("managerKind") as ManagerKind
const filterLabel = computed(function() {
	switch(managerKind) {
		case "secretary":
			return "Status"
		case "service":
			return "Job Title"
		default:
			return "Role"
	}

})

function emitUpdatedFilter(event: Event) {
	const target = event.target as HTMLSelectElement
	emit("update:filter", target.value)
}
</script>