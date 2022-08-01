<template>
	<AdminSettingsHeader title="Admin Settings" />
	<UsersManager :resource="users" :has-dropdown-filter="true" />
</template>

<style>
</style>

<script setup lang="ts">
import { onMounted, provide, ref } from "vue"
import { deserialise } from "kitsu-core"

import type { ManagerKind } from "@/resource_management/types"

import UsersManager from "@/resource_management/resource_manager.vue"
import AdminSettingsHeader from "@/tabbed_page_header.vue"
import RoleFetcher from "$@/communicators/role"
import DepartmentFetcher from "$@/communicators/department"


const managerKind = "admin" as ManagerKind
provide("managerKind", managerKind)
provide("tabs", ["Users", "Roles", "Departments"])

RoleFetcher.initialize("/api")
DepartmentFetcher.initialize("/api")

interface RawUser {
	id: number,
	name: string,
	email: string,
	kind: string,
	signature: string
}
const users = ref<RawUser[]>([])
const roles = ref<string[]>([])
onMounted(() => {
	// TODO: fetch("/api/user/list") soon
	fetch("/dev/sample_user_list")
	.then(response => response.json())
	.then(response => {
		const deserializedData = deserialise(response).data
		const rolesNoDuplicate = new Set([...roles.value])
		users.value = deserializedData

		users.value.forEach((user: RawUser | any) => user.roles.data.forEach((role: any) => rolesNoDuplicate.add(role.name)))
		roles.value = [...rolesNoDuplicate]
		// Check the console for other available info from server
		console.log(deserializedData)
	})
})
provide("filterList", roles.value)
</script>
