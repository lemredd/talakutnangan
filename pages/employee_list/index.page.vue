<template>
    <h1 class="text-2xl m-2 ">Employees</h1>
        <UsersManager :resource="users" :has-dropdown-filter="true" />
</template>

<style>
</style>

<script setup lang="ts">
import type { PageContext } from "#/types"
import type { DeserializedUserProfile, DeserializedUserResource } from "$/types/documents/user"

import { onMounted, provide, ref, inject } from "vue"

import RoleFetcher from "$@/fetchers/role"
import UserFetcher from "$@/fetchers/user"
import Manager from "@/resource_management/manager"
import UsersManager from "@/resource_management/resource_manager.vue"

const pageContext = inject("pageContext") as PageContext

RoleFetcher.initialize("/api")
UserFetcher.initialize("/api")

provide("managerKind", new Manager(pageContext.pageProps.userProfile! as DeserializedUserProfile))

const users = ref<DeserializedUserResource[]>([])
onMounted(() => {
	const currentUserProfile = pageContext.pageProps.userProfile as DeserializedUserProfile
	const currentUserDepartment = currentUserProfile.data.department.data.id

	new UserFetcher().list({
		filter: {
			slug: "",
			department: currentUserDepartment,
			role: "*",
			kind: "*",
			existence: "exists"
		},
		sort: [ "name" ],
		page: {
			offset: 0,
			limit: 10
		}
	}).then(({ body: deserializedUserList }) => {
		users.value = deserializedUserList.data
	})
})

</script>
