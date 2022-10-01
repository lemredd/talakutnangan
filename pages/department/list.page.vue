<template>
	<AdminSettingsHeader title="Admin Configuration"/>

	<DeptManager :resource="list" :is-loaded="isLoaded">
		<template #search-filter>
			<SearchFilter :resource="list" @filter-resource-by-search="getFilteredList"/>
		</template>

		<DeptList :filtered-list="list"/>
	</DeptManager>
</template>

<script setup lang="ts">
import { onMounted, provide, inject, ref } from "vue"

import type { PageContext } from "$/types/renderer"
import type { PossibleResources } from "$@/types/independent"
import type { DeserializedDepartmentResource } from "$/types/documents/department"

import DepartmentFetcher from "$@/fetchers/department"

import SearchFilter from "@/helpers/search_bar.vue"
import AdminSettingsHeader from "@/tabbed_page_header.vue"
import DeptManager from "@/resource_management/resource_manager.vue"
import DeptList from "@/resource_management/resource_manager/resource_list.vue"

type RequiredExtraProps =
	| "userProfile"
	| "departments"
const pageContext = inject("pageContext") as PageContext<"deserialized", RequiredExtraProps>
const { pageProps } = pageContext

provide("tabs", [ "Users", "Roles", "Departments" ])

const fetcher = new DepartmentFetcher()

const isLoaded = ref<boolean>(false)
const list = ref<DeserializedDepartmentResource[]>(
	pageProps.departments.data as DeserializedDepartmentResource[]
)

const filteredList = ref<DeserializedDepartmentResource[]>([])

function getFilteredList(resource: PossibleResources[]) {
	filteredList.value = resource as DeserializedDepartmentResource[]
}

async function fetchDepartmentInfos(offset: number): Promise<number|void> {
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

		if (deserializedData.length === 0) return Promise.resolve()

		list.value = [ ...list.value, ...deserializedData ]

		// eslint-disable-next-line no-use-before-define
		return countUsersPerDepartment(IDsToCount)
	})
}

async function countUsersPerDepartment(IDsToCount: string[]) {
	await fetcher.countUsers(IDsToCount).then(response => {
		const deserializedData = response.body.data
		const originalData = [ ...list.value ]

		for (const identifierData of deserializedData) {
			const { id, meta } = identifierData

			const index = originalData.findIndex(data => data.id === id)
			originalData[index].meta = meta
		}

		list.value = originalData

		return fetchDepartmentInfos(originalData.length)
	})
}

onMounted(async() => {
	await countUsersPerDepartment(list.value.map(item => item.id))
	isLoaded.value = true
})
</script>
