<template>
	<div class="controls-bar">
		<slot name="search-filter">
			<!-- TODO: search filter rearrangement - unuse slot -->
			<!-- purpose: place search filter component properly in the UI -->
		</slot>
		<div v-if="isResourceTypeUser" class="filters">
			<DropdownFilter by="Role"/>
			<DropdownFilter v-if="managerKind.isAdmin()" by="Department"/>
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
import { computed, inject } from "vue"

import type { PossibleResources } from "$@/types/independent"
import type { DeserializedUserResource } from "$/types/documents/user"

import Manager from "$/helpers/manager"
import Suspensible from "@/suspensible.vue"
import DropdownFilter from "@/resource_management/resource_manager/dropdown_filter.vue"

const { resource } = defineProps<{
	resource: PossibleResources[]
}>()

function usersResourceEnsurer(resourceItem: any): resourceItem is DeserializedUserResource {
	const deserializedResourceItem = resourceItem as DeserializedUserResource
	return deserializedResourceItem.type === "user"
}

const isResourceTypeUser = computed(() => resource.some(usersResourceEnsurer))
const managerKind = inject("managerKind") as Manager

</script>
