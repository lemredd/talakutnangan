<template>
	<AdminSettingsHeader title="Admin Settings" />

	<DeptManager :resource="departments" >
		<DeptList :search-filter="searchFilter" :filtered-list="departments" />

	</DeptManager>
</template>

<script setup lang="ts">
import { onMounted, provide, ref } from "vue"

import type { DeserializedDepartmentResource } from "$/types/documents/department"

import Manager from "@/resource_management/manager"
import DeptManager from "@/resource_management/resource_manager.vue"
import DeptList from "@/resource_management/resource_manager/resource_list.vue"
import AdminSettingsHeader from "@/tabbed_page_header.vue"
import DepartmentFetcher from "$@/fetchers/department"
import deserialize from "$/helpers/deserialize"


provide("managerKind", new Manager("admin"))
provide("tabs", ["Users", "Roles", "Departments"])

DepartmentFetcher.initialize("/api")

// TODO: use actual depts from db soon
const searchFilter = ref("")
const departments = ref<DeserializedDepartmentResource[]>([])

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
