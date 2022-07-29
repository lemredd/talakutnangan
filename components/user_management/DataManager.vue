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
import type { ManagerKind, Department, Role } from "./types"
import type { UserProfile } from "$/types/common_front-end"
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
	resource: UserProfile[] | Department[] | Role[],
	hasDropdownFilter?: boolean
}>()

const searchFilterText = ref("");

function passedResource(): (UserProfile|Department|Role)[] {
	return resource
}

const filteredList = computed(function() {
	const filteredBySearchResult = passedResource().filter((resourceToFilter: UserProfile | Department | Role) =>
		(resourceToFilter!.name as string).toLowerCase().includes(searchFilterText.value.toLowerCase())
	);

	return filteredBySearchResult
})

function isResourceItemTypeUser(resourceItem: any): resourceItem is UserProfile {
	return (resourceItem as UserProfile).email !== undefined
}

const selectedFilter = ref("all")
const availableFilters = ref<string[]>(["all"])

watch(selectedFilter, () => console.log(selectedFilter.value))
provide("searchFilterText", searchFilterText)
</script>
