<template>
	<div class="overflowing-table">
		<table>
			<thead>
				<tr>
					<th>Name</th>
					<th>E-mail</th>
					<th>Role</th>
					<th>Department</th>
				</tr>
			</thead>
			<tbody v-if="resourceType == 'user'">
				<tr
					v-for="resource in filteredList"
					:key="resource.id"
					class="resource-row">
					<td>{{ resource.name }}</td>
					<td>{{ resource.email }}</td>
					<td>{{ resource.roles.data[0].name }}</td>
					<td :title="resource.department.data.fullName">
						{{ resource.department.data.acronym }}
					</td>
				</tr>
			</tbody>
			<tbody v-else-if="resourceType === 'role'" class="resource-properties">
				<tr
					v-for="resource in filteredList"
					:key="resource.id"
					class="resource-row">
					<td>{{ resource.name }}</td>
					<td>{{ resource }} users</td>
				</tr>
			</tbody>

			<tbody v-else class="resource-properties">
				<tr
					v-for="resource in filteredList"
					:key="resource.id"
					class="resource-row">
					<td>{{ resource.fullName }}</td>
					<td>{{ resource }} users</td>
				</tr>
			</tbody>
		</table>
	</div>
	<!-- <div
		v-for="resource in filteredList"
		:key="resource.id"
		class="resource-row">
		<div v-if="resourceType === 'user'" class="resource-properties">
			<span>{{ resource.name }}</span>
			<span>{{ resource.email }}</span>
			<span>{{ resource.roles.data[0].name }}</span>
		</div>

		<div v-else-if="resourceType === 'role'" class="resource-properties">
			<span>{{ resource.name }}</span>
			<span>{{ resource }} users</span>
		</div>

		<div v-else class="resource-properties">
			<span>{{ resource.fullName }}</span>
			<span>{{ resource }} users</span>
		</div>
		<div class="btns">
			<button class="btn1">
				Update
			</button>
		</div>
	</div> -->

	<div v-if="!filteredList.length" class="no-results">
		<p>No results found!</p>
	</div>
</template>

<style scoped lang="scss">
.resource-row {
	@apply dark:text-light-100;
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

.overflowing-table{
	overflow-x: scroll;

	table {
		width: 100%;
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
	// Displays retrieved data from database properly
	if (filteredList.length) {
		resourceType.value = filteredList[0].type

		filteredList.forEach((element:any) => {
			const nonIDProperties = new Set<string>([])
			Object.keys(element).forEach(key => {
				nonIDProperties.add(key)
			})
			console.log(element)
			resourceProperties.value = [ ...nonIDProperties ]
		})
	}
})
</script>
