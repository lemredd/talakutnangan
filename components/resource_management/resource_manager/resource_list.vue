<template>
	<div class="resource-row" v-for="resource in filteredList" :key="resource.id">

		<div class="resource-properties" v-if="resourceType === 'user'">
			<span>{{ resource.name }}</span>
			<span>{{ resource.email }}</span>
			<span>{{ resource.roles.data[0].name }}</span>
		</div>
		<div class="resource-properties" v-else-if="resourceType === 'role'">
			<span>{{ resource.name }}</span>
			<span>{{ resource }} users</span>
		</div>
		<div class="resource-properties" v-else>
			<span>{{ resource.fullName }}</span>
			<span>{{ resource }} users</span>
		</div>
		<div class="btns">
			<button class="btn1">Update</button>
		</div>
	</div>

	<div class="no-results" v-if="!filteredList.length">
		<p>No results found!</p>
	</div>
</template>

<style scoped lang="scss">
.resource-row {
	@apply dark:text-light-100 flex flex-col gap-2 sm:items-center sm:flex-row sm:justify-between;
	margin: .5rem;
	border-bottom-width: 1px;
	padding-bottom: .5rem;
	font-size: 1.5rem;

	.resource-properties {
		@apply flex flex-col w-[max-content];
		font-size: 1.125rem;

		& span:not(:first-of-type) {
			font-size: 0.75rem;
			margin: 1em 0;
		}

		@screen sm {
			width: 20%;
		}
	}

	.btn1 {
		@apply dark:bg-dark-300 bg-light-600 rounded-md w-20 text-base h-7;
	}
}
</style>

<script setup lang="ts">
import { inject, onUpdated, ref } from "vue"

import type { PossibleResources } from "$@/types/independent"

import Manager from "$/helpers/manager"

const { filteredList } = defineProps<{
	filteredList: PossibleResources[]
}>()

const managerKind = inject("managerKind") as Manager
const resourceType = ref("")

const resourceProperties = ref<string[]>([])

onUpdated(() => {
	// displays retrieved data from database properly
	if (filteredList.length) {
		resourceType.value = filteredList[0].type

		filteredList.forEach((element:any) => {
			const non_id_properties = new Set<string>([])
			Object.keys(element).forEach(key => {
				non_id_properties.add(key)
			});
			resourceProperties.value = [...non_id_properties]
		});
	}
})
</script>
