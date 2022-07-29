<template>
	<div class="controls-bar">
		<SearchFilter/>
		<Filter/>
	</div>
	<ResourceList :search-filter="searchFilterText" :filtered-list="filteredList" />

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
import { computed, inject, onUpdated, provide, ref, watch } from "vue"
import type { ManagerKind, User, Department, Role } from "./types"
import Filter from "./users_manager/Filter.vue"
import SearchFilter from "./users_manager/SearchBar.vue"
import ResourceList from "./users_manager/DataList.vue"
import { deserialise } from "kitsu-core"
import uniq from "lodash.uniq"

/*
	General TODOs
	TODO: use type guarding instead of depending on "hasDropdownFilter" prop
*/

const { resource, hasDropdownFilter } = defineProps<{

	resource: User[] | Department[] | Role[],
	hasDropdownFilter?: boolean
}>()

const searchFilterText = ref("");

function passedResource(): (User|Department|Role)[] {
	return resource
}

const filteredList = computed(function() {
	const filteredBySearchResult = passedResource().filter((resourceToFilter: User | Department | Role) =>
		resourceToFilter.name.toLowerCase().includes(searchFilterText.value.toLowerCase())
	);

	if (hasDropdownFilter) {
		const filteredByRole = filterByRole(filteredBySearchResult)
		return filteredByRole
	}

	return filteredBySearchResult
})

function isResourceItemTypeUser(resourceItem: any): resourceItem is User {
	return (resourceItem as User).email !== undefined
}
function getUserRoleName(user: User) {
	return user.roles!.data[0].name
}

const selectedFilter = ref("all")
const availableFilters = ref<string[]>(["all"])
onUpdated(() => {
	console.log("resource successfully loaded")
	if (resource.some(isResourceItemTypeUser)) {
		resource.map((resourceItem) => {
			const user = resourceItem as User
			const role = getUserRoleName(user)

			availableFilters.value.push(role)
		})
	}

	availableFilters.value = uniq(availableFilters.value)
})

function filterByDropdown(e: Event) {
	const target = e.target as HTMLSelectElement
	if (resource.some(isResourceItemTypeUser)) {
		const filteredByDropdown = (resource as User[]).filter(user => (getUserRoleName(user) === target.value))

		console.log("Selected Filter", target.value)
		console.log("Filtered List", filteredByDropdown)
	}
}

function filterByRole(usersList: {[key:string]: any}[]) {
	if (hasDropdownFilter) {
		const managerKind = inject("managerKind") as ManagerKind

		if (selectedFilter.value === "all") return usersList
		if (managerKind === "service") return usersList.filter(user => user.jobTitle === selectedFilter.value)
		return usersList.filter(user => user.role === selectedFilter.value)
	}
}
watch(selectedFilter, () => console.log(selectedFilter.value))
provide("searchFilterText", searchFilterText)
</script>
