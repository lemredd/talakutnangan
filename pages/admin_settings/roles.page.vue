<template>
	<AdminSettingsHeader title="Admin Settings" />

	<RolesManager :resource="roles" />

</template>

<script setup lang="ts">
import { onMounted, provide, ref } from "vue"

import type { DeserializedRoleResource } from "$/types/documents/role"

import RolesManager from "@/resource_management/resource_manager.vue"
import AdminSettingsHeader from "@/tabbed_page_header.vue"
import RoleFetcher from "$@/fetchers/role"
import deserialize from "$/helpers/deserialize"
import Manager from "@/resource_management/manager"


provide("managerKind", new Manager("admin"))
provide("tabs", ["Users", "Roles", "Departments"])

RoleFetcher.initialize("/api")

// TODO: use actual roles from db soon
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
		console.log(deserializedData)
	})
})
</script>
