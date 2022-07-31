<template>
	<div class="controls-bar">
		<SearchFilter/>
		<div v-if="isResourceTypeUser" class="filters">
			<DropdownFilter by="Role"/>
			<DropdownFilter v-if="managerKind === 'admin'" by="Department"/>
		</div>
	</div>
	<ResourceList :search-filter="searchFilterText" :filtered-list="filteredList" />

</template>

<style lang="scss">
// TODO: Fix filter styles
.controls-bar {
	@apply dark:bg-dark-100 bg-light-600 gap-y-4 justify-between;

	.search-bar {
		@apply dark:bg-dark-300 bg-gray-300 flex justify-between items-center;
		padding: .25em;
	}

	.filters {
		@apply flex justify-between;
	}
}
</style>

<script setup lang="ts">
import { computed, inject, onUpdated, provide, ref, watch } from "vue"
import type { ManagerKind, Department, Role } from "./types"
import type { UserProfile } from "$/types/common_front-end"
import DropdownFilter from "./resource_manager/dropdown_filter.vue"
import SearchFilter from "./resource_manager/search_bar.vue"
import ResourceList from "./resource_manager/resource_list.vue"
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

const isResourceTypeUser = computed(() => (resource.some(usersResourceEnsurer)))
const searchFilterText = ref("");
const managerKind = inject("managerKind") as ManagerKind

function passedResource(): (UserProfile|Department|Role)[] {
	return resource
}

const filteredList = computed(function() {
	const filteredBySearchResult = passedResource().filter((resourceToFilter: UserProfile | Department | Role) =>
		(resourceToFilter!.name as string).toLowerCase().includes(searchFilterText.value.toLowerCase())
	);

	return filteredBySearchResult
})

function usersResourceEnsurer(resourceItem: any): resourceItem is UserProfile {
	return (resourceItem as UserProfile).type === "user"
}

const selectedFilter = ref("all")
const availableFilters = ref<string[]>(["all"])

provide("searchFilterText", searchFilterText)
</script>
