<template>
	<div class="controls-bar">
		<div class="search-bar">
			<TextualField
				type="email"
				v-model="searchFilter"
				input-classes="!py-0 pl-1 !border-none !w-100" />
			<button class="material-icons">search</button>
		</div>
		<Filter v-if="hasFilter" v-model:filter="selectedFilter"/>
		<slot v-else></slot>
	</div>
	<UsersList :search-filter="searchFilter" :filtered-list="filteredList"/>

</template>

<style lang="scss">
.controls-bar {
	@apply dark:bg-dark-100 bg-light-600 grid gap-y-4 sm:grid-cols-2;
	padding: .5em;

	.search-bar {
		@apply dark:bg-dark-300 bg-gray-300 flex justify-between items-center;
		padding: .25em;
	}
}
</style>

<script setup lang="ts">
import { computed, inject, ref } from "vue"
import TextualField from "@/fields/Textual.vue"
import type { ManagerKind, User } from "./types"
import Filter from "./users_manager/Filter.vue"
import UsersList from "./users_manager/UsersList.vue"

const { data, hasFilter } = defineProps<{
	data: User[],
	hasFilter?: boolean
}>()

let searchFilter = ref("");

const filteredList = computed(function() {
	const filteredBySearchResult = data.filter((data) =>
		data.name.toLowerCase().includes(searchFilter.value.toLowerCase())
	);

	const filteredByRole = filterByRole(filteredBySearchResult)
	return filteredByRole
})

const selectedFilter = ref("all")
function filterByRole(usersList: {[key:string]: any}[]) {
	const managerKind = inject("managerKind") as ManagerKind

	if (selectedFilter.value === "all") return usersList
	if (managerKind === "service") return usersList.filter(user => user.jobTitle === selectedFilter.value)
	return usersList.filter(user => user.role === selectedFilter.value)
}
</script>
