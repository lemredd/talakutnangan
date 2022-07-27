<template>
	<h1 class="">Institute Name</h1>
	<UsersManager :resource="users" :has-dropdown-filter="true"/>

</template>

<script setup lang="ts">
import { onMounted, provide, ref } from "vue"
import { deserialise } from "kitsu-core"

import type { ManagerKind } from "@/user_management/types"

import UsersManager from "@/user_management/DataManager.vue"

provide("managerKind", "dean" as ManagerKind)
provide("tabs", ["Users", "Roles", "Departments"])


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
	})
})
provide("filterList", roles)
</script>
