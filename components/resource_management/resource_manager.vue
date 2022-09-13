<template>
	<div class="controls-bar">
		<slot name="search-filter">
			<!-- TODO: search filter rearrangement - unuse slot -->
			<!-- purpose: place search filter component properly in the UI -->
		</slot>
		<div v-if="isResourceTypeUser" class="filters">
			<SelectableFilter
				v-model="selectedRole"
				:options="roleFilterOptions"
				label="Role"/>
			<SelectableFilter
				v-if="managerKind.isAdmin()"
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
import { computed, inject, ref } from "vue"

import type { OptionInfo } from "$@/types/component"
import type { PossibleResources } from "$@/types/independent"
import type { PageContext, PageProps } from "$/types/renderer"
import type { DeserializedUserResource } from "$/types/documents/user"
import type { DeserializedDepartmentListDocument } from "$/types/documents/department"

import Manager from "$/helpers/manager"

import Suspensible from "@/suspensible.vue"
import SelectableFilter from "@/fields/selectable_options.vue"

type AdditionalFilter = "departments" | "roles"

const { resource } = defineProps<{
	resource: PossibleResources[]
}>()

function usersResourceEnsurer(resourceItem: any): resourceItem is DeserializedUserResource {
	const deserializedResourceItem = resourceItem as DeserializedUserResource
	return deserializedResourceItem.type === "user"
}

const isResourceTypeUser = computed(() => resource.some(usersResourceEnsurer))
const managerKind = inject("managerKind") as Manager
const pageContext = inject("pageContext") as PageContext
const { pageProps } = pageContext
let departmentFilterOptions: OptionInfo[] = []

function getFilterOptions(resources: PossibleResources[]) {
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
	return filterOptions
}

if (managerKind.isAdmin()) {
	const { "departments": rawDepartments }
	= pageProps as PageProps<"deserialized", AdditionalFilter>
	departmentFilterOptions
	= getFilterOptions((rawDepartments as DeserializedDepartmentListDocument).data) as OptionInfo[]
}
const { "roles": rawRoles } = pageProps as PageProps<"deserialized", AdditionalFilter>

const roleFilterOptions = getFilterOptions(rawRoles.data) as OptionInfo[]
const selectedDepartment = ref("")
const selectedRole = ref("")

console.log(departmentFilterOptions)
</script>
