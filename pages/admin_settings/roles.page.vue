<template>
	<AdminSettingsHeader title="Admin Settings" />

	<RolesManager :resource="roles" >
		<button class="material-icons">add</button>
	</RolesManager>
</template>

<script setup lang="ts">
import { provide, ref } from "vue"

import type { ManagerKind, Role } from "@/user_management/types"

import RolesManager from "@/user_management/DataManager.vue"
import AdminSettingsHeader from "@/tabbed_page_header.vue"

provide("managerKind", "admin" as ManagerKind)
provide("tabs", ["Users", "Roles", "Departments"])

// TODO: use actual roles from db soon
const roles = ref<Role[]>([
	{
		id: 0,
		name: "Role 1",
		users: 555
	},
	{
		id: 1,
		name: "Role 2",
		users: 555
	}
])
</script>
