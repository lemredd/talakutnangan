<template>
	<div class="controls-bar">
		<slot name="search-filter">
			<!-- purpose: place search filter component properly in the UI -->
		</slot>
		<div v-if="isResourceTypeUser" class="filters">
			<DropdownFilter by="Role"/>
			<DropdownFilter v-if="managerKind.isAdmin()" by="Department"/>
		</div>
	</div>
	<slot>

	</slot>
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
import { computed, inject } from "vue"

import type { PossibleResources } from "$@/types/independent"
import type { DeserializedUserResource } from "$/types/documents/user"

import DropdownFilter from "@/resource_management/resource_manager/dropdown_filter.vue"
import manager from "./manager"

const { resource } = defineProps<{
	resource: PossibleResources[]
}>()

const isResourceTypeUser = computed(() => (resource.some(usersResourceEnsurer)))
const managerKind = inject("managerKind") as manager

function usersResourceEnsurer(resourceItem: any): resourceItem is DeserializedUserResource {
	return (resourceItem as DeserializedUserResource).type === "user"
}
</script>
