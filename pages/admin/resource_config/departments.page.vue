<template>
	<AdminSettingsHeader title="Admin Settings" />

	<DeptManager :resource="departments" >
		<template #search-filter>
			<SearchFilter :resource="departments" @filter-resource-by-search="getFilteredList"/>
		</template>

		<DeptList :filtered-list="filteredList" />
	</DeptManager>
</template>

<script setup lang="ts">
import { inject, onMounted, provide, ref } from "vue"

import type { PageContext } from "#/types"
import type { PossibleResources } from "$@/types/independent"
import type { DeserializedUserProfile } from "$/types/documents/user"
import type { DeserializedDepartmentResource } from "$/types/documents/department"

import deserialize from "$/helpers/deserialize"
import Manager from "@/resource_management/manager"
import DepartmentFetcher from "$@/fetchers/department"
import AdminSettingsHeader from "@/tabbed_page_header.vue"
import DeptManager from "@/resource_management/resource_manager.vue"
import SearchFilter from "@/resource_management/resource_manager/search_bar.vue"
import DeptList from "@/resource_management/resource_manager/resource_list.vue"


const pageContext = inject("pageContext") as PageContext

provide("managerKind", new Manager(pageContext.pageProps.userProfile! as DeserializedUserProfile))
provide("tabs", ["Users", "Roles", "Departments"])

DepartmentFetcher.initialize("/api")

const departments = ref<DeserializedDepartmentResource[]>([])
const filteredList = ref<DeserializedDepartmentResource[]>([])

function getFilteredList(resource: PossibleResources[]) {
	filteredList.value = resource as DeserializedDepartmentResource[]
}

onMounted(async () => {
	await new DepartmentFetcher().list({
		filter: {
			existence: "exists"
		},
		page: {
			limit: 10,
			offset: 0,
		},
		sort: ["fullName"]
	}).then(response => {
		const deserializedData = deserialize(response.body)!.data as DeserializedDepartmentResource[]
		departments.value = deserializedData
	})
})
</script>
