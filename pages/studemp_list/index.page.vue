<template>
	<h1 class="">Institute Name</h1>
	<UsersManager :resource="users" :has-dropdown-filter="true"/>

</template>

<script setup lang="ts">
import type { DeserializedUserResource } from "$/types/documents/user"

import { onMounted, provide, ref } from "vue"

import deserialize from "$/helpers/deserialize"
import Manager from "@/resource_management/manager"
import UsersManager from "@/resource_management/resource_manager.vue"
import RoleFetcher from "$@/fetchers/role"

provide("managerKind", new Manager("dean"))

// Fetcher Initializers
RoleFetcher.initialize("/api")

const users = ref<DeserializedUserResource[]>([])
onMounted(() => {

	// TODO: fetch("/api/user/list") soon
	fetch("/dev/sample_user_list")
	.then(response => response.json())
	.then(response => {
		const deserializedData = deserialize(response)!.data as DeserializedUserResource[]
		users.value = deserializedData
	})
})
</script>
