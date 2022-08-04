<template>
	<h1 class="text-2xl m-2 ">Employees of {{ currentUserDepartment.fullName }}</h1>
	<UsersManager :resource="users">
		<template #search-filter>
			<!-- TODO: search filter rearrangement - declare outside of template -->
			<SearchFilter :resource="users" @filter-resource-by-search="getFilteredList"/>
		</template>

		<UsersList :filtered-list="filteredList" />
	</UsersManager>
</template>

<style>
</style>

<script setup lang="ts">
import { onMounted, provide, ref, inject } from "vue"

import type { PageContext } from "#/types"
import type { PossibleResources } from "$@/types/independent"
import type { DeserializedUserProfile, DeserializedUserResource } from "$/types/documents/user"

import Manager from "@/resource_management/manager"
import UsersManager from "@/resource_management/resource_manager.vue"
import UsersList from "@/resource_management/resource_manager/resource_list.vue"
import SearchFilter from "@/resource_management/resource_manager/search_bar.vue"
import RoleFetcher from "$@/fetchers/role"
import UserFetcher from "$@/fetchers/user"
import DepartmentFetcher from "$@/fetchers/department"

const pageContext = inject("pageContext") as PageContext

RoleFetcher.initialize("/api")
UserFetcher.initialize("/api")
DepartmentFetcher.initialize("/api")

provide("managerKind", new Manager(pageContext.pageProps.userProfile! as DeserializedUserProfile))

const users = ref<DeserializedUserResource[]>([])
const filteredList = ref<DeserializedUserResource[]>([])

function getFilteredList(resource: PossibleResources[]) {
	filteredList.value = resource as DeserializedUserResource[]
}

const currentUserProfile = (pageContext.pageProps.userProfile! as DeserializedUserProfile).data
const currentUserDepartment = currentUserProfile!.department.data

onMounted(() => {
	new UserFetcher().list({
		filter: {
			slug: "",
			department: currentUserDepartment.id,
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
