<template>
	<div class="resource-row" v-for="resource in filteredList" :key="resource.name">
		<div class="resource-properties" v-if="resourceType === 'user'">
			<span>{{ resource.name }}</span>
			<span>{{ resource.email }}</span>
			<span>{{ resource.roles.data[0].name }}</span>
		</div>
		<div class="resource-properties" v-else>
			<span>{{ resource.name }}</span>
			<span>{{ resource.users }} users</span>
		</div>
		<div class="btns">
			<button class="btn1">Update</button>
		</div>
	</div>

	<div class="no-results" v-if="searchFilter && !filteredList.length">
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
		@apply flex flex-col;
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
import { computed, inject, onUpdated, ref } from "vue"
import { ManagerKind, User } from "../types";

const { searchFilter, filteredList } = defineProps<{
	searchFilter: string,
	filteredList: any
}>()

const managerKind = inject("managerKind") as ManagerKind
const resourceType = ref("")

const resourceProperties = ref<string[]>([])


// TODO: will be removed once all data are retrieved from database
filteredList.forEach((element:any) => {
	const non_id_properties = new Set<string>([])
	Object.keys(element).forEach(key => {
		non_id_properties.add(key)
	});
	resourceProperties.value = [...non_id_properties]
});

onUpdated(() => {
	// displays retrieved data from database properly
	resourceType.value = filteredList[0].type
	console.log(resourceType.value)
	filteredList.forEach((element:any) => {
		const non_id_properties = new Set<string>([])
		Object.keys(element).forEach(key => {
			non_id_properties.add(key)
		});
		resourceProperties.value = [...non_id_properties]
	});
})
</script>
