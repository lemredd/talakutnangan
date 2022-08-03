<template>
	<AdminSettingsHeader title="Admin Settings" />

	<RolesManager :resource="roles">
		<RolesList :search-filter="searchFilter" :filtered-list="roles" />

	</RolesManager>

</template>

<script setup lang="ts">
import { onMounted, provide, ref } from "vue"

import type { DeserializedRoleResource } from "$/types/documents/role"

import AdminSettingsHeader from "@/tabbed_page_header.vue"
import RolesManager from "@/resource_management/resource_manager.vue"
import RolesList from "@/resource_management/resource_manager/resource_list.vue"
import RoleFetcher from "$@/fetchers/role"
import deserialize from "$/helpers/deserialize"
import Manager from "@/resource_management/manager"


provide("managerKind", new Manager("admin"))
provide("tabs", ["Users", "Roles", "Departments"])

RoleFetcher.initialize("/api")

const searchFilter = ref("")
const roles = ref<DeserializedRoleResource[]>([])

onMounted(async () => {
	await new RoleFetcher().list({
		filter: {
			existence: "exists",
			department: "*"
		},
		page: {
			limit: 10,
			offset: 0
		},
		sort: ["name"]
	})
	.then(response => {
		const { body } = response
		const deserializedData = deserialize(body)!.data as DeserializedRoleResource[]
		roles.value = deserializedData
	})
})
</script>
