<template>
	<AdminSettingsHeader title="Admin Settings" />

	<UsersManager :resource="users">
		<template #search-filter>
			<SearchFilter :resource="users" @filter-resource-by-search="getFilteredList"/>
		</template>

		<UsersList :search-filter="searchFilter" :filtered-list="filteredList" />
	</UsersManager>
</template>

<style>
</style>

<script setup lang="ts">
import { onMounted, provide, ref } from "vue"

import type { PossibleResources } from "$@/types/independent"
import type { DeserializedUserResource } from "$/types/documents/user"

import AdminSettingsHeader from "@/tabbed_page_header.vue"
import Manager from "@/resource_management/manager"
import SearchFilter from "@/resource_management/resource_manager/search_bar.vue"
import UsersManager from "@/resource_management/resource_manager.vue"
import UsersList from "@/resource_management/resource_manager/resource_list.vue"

import RoleFetcher from "$@/fetchers/role"
import DepartmentFetcher from "$@/fetchers/department"
import deserialize from "$/helpers/deserialize"

provide("managerKind", new Manager("admin"))
provide("tabs", ["Users", "Roles", "Departments"])

RoleFetcher.initialize("/api")
DepartmentFetcher.initialize("/api")

const users = ref<DeserializedUserResource[]>([])
const filteredList = ref<DeserializedUserResource[]>([])

function getFilteredList(resource: PossibleResources[]) {
	filteredList.value = resource as DeserializedUserResource[]
}

const searchFilter = ref("")
onMounted(() => {
	// TODO: fetch("/api/user/list") soon
	fetch("/dev/sample_user_list")
	.then(response => response.json())
	.then(response => {
		const deserializedData = deserialize(response)!.data as DeserializedUserResource[]
		users.value = deserializedData

		// Check the console for other available info from server
		// console.log(users.value)
	})
})

provide("resource", users)
</script>
