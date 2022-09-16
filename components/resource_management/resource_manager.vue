<template>
	<div class="controls-bar">
		<slot name="search-filter">
			<!-- TODO: search filter rearrangement - unuse slot -->
			<!-- purpose: place search filter component properly in the UI -->
		</slot>
		<div v-if="isResourceTypeUser" class="filters">
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
				label="Department"/>
		</div>
	</div>
	<Suspensible :is-loaded="!!resource.length">
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
import { computed, inject, ref, onUpdated } from "vue"

import type { OptionInfo } from "$@/types/component"
import type { PossibleResources } from "$@/types/independent"

import Manager from "$/helpers/manager"
import type { PageContext, PageProps } from "$/types/renderer"
import RequestEnvironment from "$/singletons/request_environment"
import type { DeserializedUserResource } from "$/types/documents/user"
import type { DeserializedDepartmentListDocument } from "$/types/documents/department"


import Suspensible from "@/suspensible.vue"
import SelectableFilter from "@/fields/selectable_options.vue"

type AdditionalFilter = "departments" | "roles"
type DefinedEmits = {
	(e: "filterByRole", id: string | number): void
	(e: "filterByDept", id: string | number): void
}

const { resource } = defineProps<{
	resource: PossibleResources[]
}>()

const emit = defineEmits<DefinedEmits>()

function userResourceEnsurer(resourceItem: any): resourceItem is DeserializedUserResource {
	const deserializedResourceItem = resourceItem as DeserializedUserResource
	return deserializedResourceItem.type === "user"
}

const isResourceTypeUser = computed(() => resource.some(userResourceEnsurer))
const managerKind = inject("managerKind") as Manager
const pageContext = inject("pageContext") as PageContext
const { pageProps } = pageContext
const selectedDepartment = ref("")
const selectedRole = ref("")
const departmentFilterOptions = ref<OptionInfo[]>([])
const roleFilterOptions = ref<OptionInfo[]>([])

function getFilterOptions(resources: PossibleResources[]) {
	const filterOptions = resources.map(resourceFilterOption => {
		const resourceType = resourceFilterOption.type
		return {
			"label": String(
				resourceType === "department"
					? resourceFilterOption.acronym
					: resourceFilterOption.name
			),
			"value": String(RequestEnvironment.isOnTest
				? resources.indexOf(resourceFilterOption)
				: resourceFilterOption.id)
		}
	})
	return filterOptions
}

function filterByAdditional(selectedFilterId: string, filterKind: AdditionalFilter) {
	if (filterKind === "roles") emit("filterByRole", selectedFilterId)
	if (filterKind === "departments") emit("filterByRole", selectedFilterId)
}

onUpdated(() => {
	if (isResourceTypeUser.value) {
		if (managerKind.isAdmin()) {
			const { "departments": rawDepartments }
			= pageProps as PageProps<"deserialized", AdditionalFilter>
			const departments
			= rawDepartments as DeserializedDepartmentListDocument

			departmentFilterOptions.value
			= getFilterOptions(departments.data) as OptionInfo[]
		}

		const { "roles": rawRoles } = pageProps as PageProps<"deserialized", AdditionalFilter>
		roleFilterOptions.value = getFilterOptions(rawRoles.data) as OptionInfo[]
	}
})
</script>
