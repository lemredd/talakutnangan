<template>
    <h1 class="text-2xl m-2 ">Employees</h1>
        <UsersManager :resource="users" :has-dropdown-filter="true" />
</template>

<style>
</style>

<script setup lang="ts">
import { onMounted, provide, ref } from "vue"
import { deserialise } from "kitsu-core"

import Manager from "@/user_management/manager"


import type { UserProfile } from "$/types/common_front-end"

import UsersManager from "@/user_management/DataManager.vue"
import RoleFetcher from "$@/communicators/role"


RoleFetcher.initialize("/api")
provide("managerKind", new Manager("service"))
const jobTitles = ref<string[]>([])

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
