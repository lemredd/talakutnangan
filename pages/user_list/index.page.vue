<template>
	<h1 class="text-2xl m-2 dark:text-light-200">Students of (Institute)</h1>
	<UsersManager :data="users" :has-dropdown-filter="true" />
</template>

<style>
</style>

<script setup lang="ts">
import { onMounted, provide, ref } from "vue"
import { deserialise } from "kitsu-core"

import UsersManager from "@/user_management/DataManager.vue"
import type { ManagerKind } from "@/user_management/types"

const managerKind = "secretary" as ManagerKind
provide("managerKind", managerKind)

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
		users.value.push({
			id: users.value.length-1,
			name: "Jarlem Redd J. de Peralta",
			email: "email.example.com",
			kind: "Student",
			signature:"ooo"
		})
		// Check the console for other available info from server
		console.log(deserializedData)
	})
})
provide("filterList", roles.value)
</script>