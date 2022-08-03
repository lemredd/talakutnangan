<template>
	<AdminSettingsHeader title="Admin Settings" />

	<DeptManager :resource="departments" >
		<button class="material-icons">add</button>
	</DeptManager>
</template>

<script setup lang="ts">
import { provide, ref } from "vue"

import type { Department, ManagerKind } from "@/resource_management/types"

import DeptManager from "@/resource_management/resource_manager.vue"
import AdminSettingsHeader from "@/tabbed_page_header.vue"

provide("managerKind", "admin" as ManagerKind)
provide("tabs", ["Users", "Roles", "Departments"])

// TODO: use actual depts from db soon
const departments = ref<Department[]>([
	{
		id: 0,
		name: "Department 1",
		users: 999
	},
	{
		id: 1,
		name: "Department 2",
		users: 999
	}
])
</script>
