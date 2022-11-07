<template>
	<div class="resource-list">
		<ResourceTable v-if="filteredList.length">
			<template #table-headers>
				<th v-for="header in tableHeaders" :key="header">
					{{ header }}
				</th>
			</template>

			<template v-if="resourceType === 'user'" #table-body>
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
					<td>
						<a
							v-if="mayEdit"
							:href="`read/${resource.id}`"
							class="read-resource-btn btn"
							type="button">
							edit
						</a>
					</td>
				</tr>
			</template>

			<template v-else-if="resourceType === 'semester'" #table-body>
				<tr
					v-for="resource in filteredList"
					:key="resource.id"
					class="resource-row">
					<td>{{ resource.name }}</td>
					<td>
						{{
							resource.semesterOrder === 'first' ? 'First' :
							resource.semesterOrder === 'second' ? 'Second' :
							'Third'
						}}
					</td>
					<td>{{ formatToCompleteFriendlyTime(resource.startAt) }}</td>
					<td>{{ formatToCompleteFriendlyTime(resource.endAt) }}</td>
					<td>
						<a
							v-if="mayEdit"
							:href="`read/${resource.id}`"
							class="read-resource-btn btn"
							type="button">
							edit
						</a>
					</td>
				</tr>
			</template>

			<template v-else-if="resourceType === 'department'" #table-body>
				<tr
					v-for="resource in filteredList"
					:key="resource.id"
					class="resource-row">
					<td>{{ resource.fullName }}</td>
					<td>{{ resource.acronym }}</td>
					<td>
						{{
							resource.mayAdmit ? "Yes": "No"
						}}
					</td>
					<td>
						<a
							v-if="mayEdit"
							:href="`read/${resource.id}`"
							class="read-resource-btn btn"
							type="button">
							edit
						</a>
					</td>
				</tr>
			</template>

			<template v-else-if="resourceType === 'audit_trail'" #table-body>
				<tr
					v-for="resource in filteredList"
					:key="resource.id"
					class="resource-row">
					<td>{{ resource.user.data.name }}</td>
					<td>{{ resource.actionName }}</td>
					<td>{{ formatToCompleteFriendlyTime(resource.createdAt) }}</td>
				</tr>
			</template>

			<template v-else #table-body>
				<tr
					v-for="resource in filteredList"
					:key="resource.id"
					class="resource-row">
					<td>
						{{
							resourceType === "role"
								? resource.name
								: `${resource.fullName} (${resource.acronym})`
						}}
					</td>
					<td>
						{{
							pluralize("user", resource.meta ? resource.meta.userCount : 0)
						}}
					</td>
					<td>
						<a
							:href="`read/${resource.id}`"
							class="btn"
							type="button">
							edit
						</a>
					</td>
				</tr>
			</template>
		</ResourceTable>

		<div v-else class="no-results">
			<p>No results found!</p>
		</div>
	</div>
</template>

<style scoped lang="scss">
@import "@styles/btn.scss";
.resource-list {
	margin-top: 1em;

	.resource-row {
		@apply dark:text-light-100;
		margin: .5rem;
		border-bottom-width: 1px;
		padding-bottom: .5rem;

		.btn1 {
			@apply dark:bg-dark-300 bg-light-600 rounded-md w-20 text-base h-7;
		}
	}

	.no-results {
		text-align: center;
	}
	.btn{
		border: none;
		border-radius: 5px;
		padding: 8px;
		text-align: center;
		text-decoration: none;
		display: inline-block;
		font-size: 12px;
	}
}
</style>

<script setup lang="ts">
import { computed } from "vue"

import type { PossibleResources } from "$@/types/independent"
import formatToCompleteFriendlyTime from "$@/helpers/format_to_complete_friendly_time"

import pluralize from "$/string/pluralize"

import ResourceTable from "@/helpers/overflowing_table.vue"

const { filteredList } = defineProps<{
	filteredList: PossibleResources[]
	mayEdit: boolean
}>()

const resourceType = computed(() => filteredList[0].type)

const tableHeaders = computed(() => {
	let headers: string[] = []
	if (resourceType.value === "semester") {
		headers = [ "Name", "Order", "Start at", "End at" ]
	} else if (resourceType.value === "user") {
		headers = [
			"Name", "E-mail", "Role", "Department"
		]
	} else if (resourceType.value === "department") {
		headers = [
			"Name", "Acronym", "May admit"
		]
	} else if (resourceType.value === "audit_trail") {
		headers = [
			"ID", "Action name", "Created at"
		]
	} else {
		headers = [ "Name", "no. of users", "" ]
	}


	return headers
})
</script>
