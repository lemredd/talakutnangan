<template>
	<UsersManager :users="users" />
</template>

<style>
</style>

<script setup lang="ts">
import { onBeforeMount, onMounted, provide, ref } from "vue"
import { deserialise } from "kitsu-core"

import UsersManager from "@/user_management/UsersManager.vue"
import type { ManagerKind } from "@/user_management/types"

const managerKind = "admin" as ManagerKind
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
	// fetch("/api/user/list")
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
