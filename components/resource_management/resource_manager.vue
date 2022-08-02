<template>
	<div class="controls-bar">
		<SearchFilter/>
		<div v-if="isResourceTypeUser" class="filters">
			<DropdownFilter by="Role"/>
			<DropdownFilter v-if="managerKind.isAdmin()" by="Department"/>
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
import type { ManagerKind } from "@/resource_management/types"
import type { DeserializedUserResource } from "$/types/documents/user"
import type { DeserializedRoleResource } from "$/types/documents/role"
import type { DeserializedDepartmentResource } from "$/types/documents/department"

import { computed, inject, provide, ref } from "vue"

import SearchFilter from "@/resource_management/resource_manager/search_bar.vue"
import ResourceList from "@/resource_management/resource_manager/resource_list.vue"
import DropdownFilter from "@/resource_management/resource_manager/dropdown_filter.vue"
import manager from "./manager"

/*
	General TODOs
	TODO: use type guarding instead of depending on "hasDropdownFilter" prop
*/

type PossibleResources =
	| DeserializedUserResource
	| DeserializedDepartmentResource
	| DeserializedRoleResource

const { resource, hasDropdownFilter } = defineProps<{
	resource: PossibleResources[],
	hasDropdownFilter?: boolean
}>()

const isResourceTypeUser = computed(() => (resource.some(usersResourceEnsurer)))
const searchFilterText = ref("");
const managerKind = inject("managerKind") as manager

const filteredList = computed(function() {
	const filteredBySearchResult = resource.filter((resourceToFilter: PossibleResources) => {
		let name = ""
		if (resourceToFilter.type === "department") {
			name = resourceToFilter.fullName
		} else {
			name = resourceToFilter.name
		}

		name.toLowerCase().includes(searchFilterText.value.toLowerCase())
	})

	return filteredBySearchResult
})

function usersResourceEnsurer(resourceItem: any): resourceItem is DeserializedUserResource {
	return (resourceItem as DeserializedUserResource).type === "user"
}

provide("searchFilterText", searchFilterText)
</script>
