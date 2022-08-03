<template>
	<h1 class="">Institute Name</h1>
	<UsersManager :resource="users" :has-dropdown-filter="true"/>

</template>

<script setup lang="ts">
import { inject, onMounted, provide, ref } from "vue"

import type { DeserializedUserResource } from "$/types/documents/user"
import type { PageContext } from "#/types"
import type { DeserializedUserProfile } from "$/types/documents/user"

import deserialize from "$/helpers/deserialize"
import Manager from "@/resource_management/manager"
import UsersManager from "@/resource_management/resource_manager.vue"
import RoleFetcher from "$@/fetchers/role"
import UserFetcher from "$@/fetchers/user"

const pageContext = inject("pageContext") as PageContext
provide("managerKind", new Manager(pageContext.pageProps.userProfile! as DeserializedUserProfile))

// Fetcher Initializers
UserFetcher.initialize("/api")
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
