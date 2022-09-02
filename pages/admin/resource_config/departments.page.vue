<template>
	<AdminSettingsHeader title="Admin Configuration"/>

	<DeptManager :resource="departments">
		<template #search-filter>
			<SearchFilter :resource="departments" @filter-resource-by-search="getFilteredList"/>
		</template>

		<DeptList :filtered-list="filteredList"/>
	</DeptManager>
</template>

<script setup lang="ts">
import { onMounted, provide, ref } from "vue"

import type { PossibleResources } from "$@/types/independent"
import type { DeserializedDepartmentResource } from "$/types/documents/department"

import DepartmentFetcher from "$@/fetchers/department"
import AdminSettingsHeader from "@/tabbed_page_header.vue"
import DeptManager from "@/resource_management/resource_manager.vue"
import SearchFilter from "@/resource_management/resource_manager/search_bar.vue"
import DeptList from "@/resource_management/resource_manager/resource_list.vue"
provide("tabs", [ "Users", "Roles", "Departments" ])

DepartmentFetcher.initialize("/api")
const fetcher = new DepartmentFetcher()

const departments = ref<DeserializedDepartmentResource[]>([])
const filteredList = ref<DeserializedDepartmentResource[]>([])

function getFilteredList(resource: PossibleResources[]) {
	filteredList.value = resource as DeserializedDepartmentResource[]
}

async function fetchDepartmentInfos(offset: number) {
	await fetcher.list({
		"filter": {
			"existence": "exists"
		},
		"page": {
			"limit": 10,
			offset
		},
		"sort": [ "fullName" ]
	}).then(response => {
		const deserializedData = response.body.data as DeserializedDepartmentResource[]
		const IDsToCount = deserializedData.map(data => data.id)

		if (deserializedData.length === 0) return

		departments.value = [ ...departments.value, ...deserializedData ]

		return countUsersPerDepartment(IDsToCount)
	})
}

async function countUsersPerDepartment(IDsToCount: number[]) {
	await fetcher.countUsers(IDsToCount).then(response => {
		const deserializedData = response.body.data
		const originalData = [ ...departments.value ]

		for (const identifierData of deserializedData) {
			const { id, meta } = identifierData

			const index = originalData.findIndex(data => data.id === id)
			originalData[index].meta = meta
		}

		departments.value = originalData

		return fetchDepartmentInfos(originalData.length)
	})
}

onMounted(async() => {
	await fetchDepartmentInfos(0)
})
</script>
