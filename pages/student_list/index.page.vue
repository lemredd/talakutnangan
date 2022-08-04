<template>
	<h1 class="text-2xl m-2 dark:text-light-200">Students of (Institute)</h1>
	<UsersManager :resource="users" :has-dropdown-filter="true" />
</template>

<style>
</style>

<script setup lang="ts">
import type { DeserializedUserResource } from "$/types/documents/user"
import type { ManagerKind } from "@/resource_management/types"

import { onMounted, provide, ref } from "vue"

import deserialize from "$/helpers/deserialize"
import UsersManager from "@/resource_management/resource_manager.vue"
import RoleFetcher from "$@/fetchers/role"

const managerKind = "secretary" as ManagerKind
provide("managerKind", managerKind)

RoleFetcher.initialize("/api")

const users = ref<DeserializedUserResource[]>([])
onMounted(() => {
	// TODO: fetch("/api/user/list") soon
	fetch("/dev/sample_user_list")
	.then(response => response.json())
	.then(response => {
		const deserializedData = deserialize(response)!.data as DeserializedUserResource[]
		users.value = deserializedData

		// Check the console for other available info from server
		console.log(deserializedData)
	})
})
</script>
