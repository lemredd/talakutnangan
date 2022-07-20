<template>
	<div class="controls-bar">
		<SearchFilter/>
		<Filter v-if="hasDropdownFilter" v-model:filter="selectedFilter"/>
		<slot v-else></slot>
	</div>
	<DataList :search-filter="searchFilterText" :filtered-list="filteredList" />

</template>

<style lang="scss">
.controls-bar {
	@apply dark:bg-dark-100 bg-light-600 grid gap-y-4 sm:grid-cols-[repeat(2,minmax(0,max-content))] justify-between;

	.search-bar {
		@apply dark:bg-dark-300 bg-gray-300 flex justify-between items-center;
		padding: .25em;
	}
}
</style>

<script setup lang="ts">
import { computed, inject, provide, ref } from "vue"
import type { ManagerKind, User, Department } from "./types"
import Filter from "./users_manager/Filter.vue"
import SearchFilter from "./users_manager/SearchBar.vue"
import DataList from "./users_manager/DataList.vue"

/*
	General TODOs
	TODO(lead): unuse type `any` / specify types
	TODO: use type guarding instead of depending on "hasDropdownFilter" prop
*/

const { data, hasDropdownFilter } = defineProps<{

	data: User[] | Department[] | any,
	hasDropdownFilter?: boolean
}>()

const searchFilterText = ref("");

const filteredList = computed(function() {
	const filteredBySearchResult = data.filter((dataToFilter: any) =>
		dataToFilter.name.toLowerCase().includes(searchFilterText.value.toLowerCase())
	);

	if (hasDropdownFilter) {
		const filteredByRole = filterByRole(filteredBySearchResult)
		return filteredByRole
	}

	return filteredBySearchResult
})

const selectedFilter = ref("all")
function filterByRole(usersList: {[key:string]: any}[]) {
	if (hasDropdownFilter) {
		const managerKind = inject("managerKind") as ManagerKind

		if (selectedFilter.value === "all") return usersList
		if (managerKind === "service") return usersList.filter(user => user.jobTitle === selectedFilter.value)
		return usersList.filter(user => user.role === selectedFilter.value)
	}
}
provide("searchFilterText", searchFilterText)
</script>
