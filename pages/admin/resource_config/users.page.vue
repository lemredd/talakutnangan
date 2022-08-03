<template>
	<AdminSettingsHeader title="Admin Settings" />
	<UsersManager :resource="users" :has-dropdown-filter="true">
		<UsersList :search-filter="searchFilter" :filtered-list="users" />
	</UsersManager>
</template>

<style>
</style>

<script setup lang="ts">
import { onMounted, provide, ref } from "vue"


import type { DeserializedUserResource } from "$/types/documents/user"

import Manager from "@/resource_management/manager"
import UsersManager from "@/resource_management/resource_manager.vue"
import UsersList from "@/resource_management/resource_manager/resource_list.vue"
import AdminSettingsHeader from "@/tabbed_page_header.vue"
import RoleFetcher from "$@/fetchers/role"
import DepartmentFetcher from "$@/fetchers/department"
import deserialize from "$/helpers/deserialize"

provide("managerKind", new Manager("admin"))
provide("tabs", ["Users", "Roles", "Departments"])

RoleFetcher.initialize("/api")
DepartmentFetcher.initialize("/api")

const searchFilter = ref("")
const users = ref<DeserializedUserResource[]>([])
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
</script>
