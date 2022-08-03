<template>
    <h1 class="text-2xl m-2 ">Employees</h1>
        <UsersManager :resource="users" />
</template>

<style>
</style>

<script setup lang="ts">
import { onMounted, provide, ref, inject } from "vue"

import type { PageContext } from "#/types"
import type { DeserializedUserProfile, DeserializedUserResource } from "$/types/documents/user"

import RoleFetcher from "$@/fetchers/role"
import UserFetcher from "$@/fetchers/user"
import DepartmentFetcher from "$@/fetchers/department"
import Manager from "@/resource_management/manager"
import UsersManager from "@/resource_management/resource_manager.vue"


const pageContext = inject("pageContext") as PageContext

RoleFetcher.initialize("/api")
UserFetcher.initialize("/api")
DepartmentFetcher.initialize("/api")

provide("managerKind", new Manager(pageContext.pageProps.userProfile! as DeserializedUserProfile))

const users = ref<DeserializedUserResource[]>([])

onMounted(() => {
	const currentUserProfile = (pageContext.pageProps.userProfile! as DeserializedUserProfile).data
	const currentUserDepartment = currentUserProfile!.department.data.id
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
