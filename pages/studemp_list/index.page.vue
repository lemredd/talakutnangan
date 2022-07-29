<template>
	<h1 class="">Institute Name</h1>
	<UsersManager :resource="users" :has-dropdown-filter="true"/>

</template>

<script setup lang="ts">
import { onMounted, provide, ref } from "vue"
import { deserialise } from "kitsu-core"

import type { ManagerKind } from "@/user_management/types"
import type { UserProfile } from "$/types/common_front-end"

import UsersManager from "@/user_management/DataManager.vue"
import RoleFetcher from "$@/communicators/role"
import DepartmentFetcher from "$@/communicators/department"

provide("managerKind", "dean" as ManagerKind)
provide("tabs", ["Users", "Roles", "Departments"])

// Fetcher Initializers
RoleFetcher.initialize("/api")
DepartmentFetcher.initialize("/api")

const users = ref<UserProfile[]>([])
const roles = ref<string[]>([])
onMounted(() => {

	// TODO: fetch("/api/user/list") soon
	fetch("/dev/sample_user_list")
	.then(response => response.json())
	.then(response => {
		const deserializedData = deserialise(response).data as UserProfile[]
		const rolesNoDuplicate = new Set([...roles.value])
		users.value = deserializedData

		users.value.forEach((user: UserProfile | any) => user.roles.data.forEach((role: any) => rolesNoDuplicate.add(role.name)))
		roles.value = [...rolesNoDuplicate]
	})
})
provide("filterList", roles)
</script>
