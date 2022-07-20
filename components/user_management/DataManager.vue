<template>
	<div class="controls-bar">
		<!-- TODO: make search bar a component -->
		<div class="search-bar">
			<TextualField
				type="email"
				v-model="searchFilter"
				input-classes="!py-0 pl-1 !border-none" />
			<button class="material-icons">search</button>
		</div>
		<Filter v-if="hasDropdownFilter" v-model:filter="selectedFilter"/>
		<slot v-else></slot>
	</div>
	<DataList :search-filter="searchFilter" :filtered-list="filteredList" />

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
import { computed, inject, ref } from "vue"
import TextualField from "@/fields/Textual.vue"
import type { ManagerKind, User, Department } from "./types"
import Filter from "./users_manager/Filter.vue"
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

let searchFilter = ref("");

const filteredList = computed(function() {
	const filteredBySearchResult = data.filter((dataToFilter: any) =>
		dataToFilter.name.toLowerCase().includes(searchFilter.value.toLowerCase())
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
</script>
