<template>
	<h1 class="">Institute Name</h1>
	<UsersManager :resource="users" :has-dropdown-filter="true"/>

</template>

<script setup lang="ts">
import { onMounted, provide, ref } from "vue"
import { deserialise } from "kitsu-core"

import type { UserProfile } from "$/types/common_front-end"

import Manager from "@/resource_management/manager"
import UsersManager from "@/resource_management/resource_manager.vue"
import RoleFetcher from "$@/communicators/role"

provide("managerKind", new Manager("dean"))

// Fetcher Initializers
RoleFetcher.initialize("/api")

const users = ref<UserProfile[]>([])
onMounted(() => {

	// TODO: fetch("/api/user/list") soon
	fetch("/dev/sample_user_list")
	.then(response => response.json())
	.then(response => {
		const deserializedData = deserialise(response).data as UserProfile[]
		users.value = deserializedData
	})
})
</script>
