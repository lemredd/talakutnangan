<template>
<div class="dropdown-filter">
	<label for="role-filter">Role: </label>
	<select
		@input="emitUpdatedFilter"
		:value="filter"
		id="role-filter"
		class="role-filter">
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

	.role-filter {
		@apply dark:bg-dark-300 bg-gray-300;
		position: relative;
	}
}
</style>

<script setup lang="ts">
const { filterList, filter } = defineProps<{
	filterList: string[],
	filter: string
}>()
const emit = defineEmits<{
	(e: "update:filter", updatedFilter: string): void
}>()

function emitUpdatedFilter(event: Event) {
	const target = event.target as HTMLSelectElement
	emit("update:filter", target.value)
}
</script>