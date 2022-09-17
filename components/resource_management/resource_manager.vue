<template>
	<div class="controls-bar">
		<slot name="search-filter">
			<!-- TODO: search filter rearrangement - unuse slot -->
			<!-- purpose: place search filter component properly in the UI -->
		</slot>
		<div v-if="props.isResourceTypeUser" class="filters">
			<SelectableFilter
				id="role-filter"
				v-model="selectedRole"
				:options="roleFilterOptions"
				label="Role"
				@update:model-value="filterByAdditional($event, 'roles')"/>
			<SelectableFilter
				v-if="managerKind.isAdmin()"
				id="dept-filter"
				v-model="selectedDepartment"
				:options="departmentFilterOptions"
				label="Department"
				@update:model-value="filterByAdditional($event, 'departments')"/>
		</div>
	</div>
	<Suspensible :is-loaded="props.isLoaded">
		<slot>
		</slot>
	</Suspensible>
</template>

<style lang="scss">
.controls-bar {
	@apply dark:bg-dark-100 bg-light-600 gap-y-4 justify-between;

	.search-bar {
		// TODO: search filter rearrangement - utilize flex order and transfer styles to component
		@apply dark:bg-dark-300 bg-gray-300 flex justify-between items-center;
		padding: .25em;
	}

	.filters {
		@apply flex flex-col sm:flex-row justify-between;
	}
}
</style>

<script setup lang="ts">
import { computed, inject, ref } from "vue"

import type { OptionInfo } from "$@/types/component"
import type { PossibleResources } from "$@/types/independent"

import Suspensible from "@/suspensible.vue"
import SelectableFilter from "@/fields/selectable_options.vue"

import Manager from "$/helpers/manager"
import type { PageContext, PageProps } from "$/types/renderer"
import RequestEnvironment from "$/singletons/request_environment"


type AdditionalFilter = "departments" | "roles"
type DefinedEmits = {
	(e: "filterByRole", id: string): void
	(e: "filterByDept", id: string): void
}

const props = defineProps<{
	isLoaded: boolean
	resource: PossibleResources[]
	isResourceTypeUser?: boolean
}>()

const emit = defineEmits<DefinedEmits>()

const managerKind = inject("managerKind") as Manager
const pageContext = inject("pageContext") as PageContext
const { pageProps } = pageContext
const selectedDepartment = ref("")
const selectedRole = ref("")

function makeFilterOptions(resources: PossibleResources[]) {
	const filterOptions = resources.map(resourceFilterOption => {
		const resourceType = resourceFilterOption.type
		return {
			"label": String(
				resourceType === "department"
					? resourceFilterOption.acronym
					: resourceFilterOption.name
			),
			"value": String(resourceFilterOption.id)
		}
	})
	filterOptions.unshift({
		"label": "All",
		"value": "*"
	})

	return filterOptions
}

const departmentFilterOptions = computed<OptionInfo[]>(() => {
	if (managerKind.isAdmin()) {
		const {
			"departments": rawDepartments
		} = pageProps as PageProps<"deserialized", AdditionalFilter>
		return makeFilterOptions(rawDepartments.data)
	}
	return []
})
const roleFilterOptions = computed<OptionInfo[]>(() => {
	const { "roles": rawRoles } = pageProps as PageProps<"deserialized", AdditionalFilter>

	return makeFilterOptions(rawRoles.data)
})


function filterByAdditional(selectedFilterId: string, filterKind: AdditionalFilter) {
	if (filterKind === "roles") emit("filterByRole", selectedFilterId)
	if (filterKind === "departments") emit("filterByDept", selectedFilterId)
}
</script>
