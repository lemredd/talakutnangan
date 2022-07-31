<template>
	<h1 class="text-2xl m-2 dark:text-light-200">Students of (Institute)</h1>
	<UsersManager :resource="users" :has-dropdown-filter="true" />
</template>

<style>
</style>

<script setup lang="ts">
import { onMounted, provide, ref } from "vue"
import { deserialise } from "kitsu-core"

import type { ManagerKind } from "@/resource_management/types"

import UsersManager from "@/resource_management/resource_manager.vue"
import { UserProfile } from "$/types/common_front-end"
import RoleFetcher from "$@/communicators/role"

const managerKind = "secretary" as ManagerKind
provide("managerKind", managerKind)

RoleFetcher.initialize("/api")

const users = ref<UserProfile[]>([])
onMounted(() => {
	// TODO: fetch("/api/user/list") soon
	fetch("/dev/sample_user_list")
	.then(response => response.json())
	.then(response => {
		const deserializedData = deserialise(response).data
		users.value = deserializedData

		// Check the console for other available info from server
		console.log(deserializedData)
	})
})
</script>
