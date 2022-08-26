<template>
	<h1 class="text-2xl m-2 ">
		Employees of {{ currentUserDepartment.fullName }}
	</h1>
	<UsersManager :resource="users">
		<template #search-filter>
			<!-- TODO: search filter rearrangement - declare outside of template -->
			<SearchFilter :resource="users" @filter-resource-by-search="getFilteredList"/>
		</template>

		<UsersList :filtered-list="filteredList"/>
	</UsersManager>
</template>

<style>
</style>

<script setup lang="ts">
import { onMounted, provide, ref, inject } from "vue"

import type { PageContext } from "$/types/renderer"
import type { PossibleResources } from "$@/types/independent"
import type { DeserializedUserProfile, DeserializedUserResource } from "$/types/documents/user"

import Manager from "$/helpers/manager"
import RoleFetcher from "$@/fetchers/role"
import UserFetcher from "$@/fetchers/user"
import DepartmentFetcher from "$@/fetchers/department"

import UsersManager from "@/resource_management/resource_manager.vue"
import UsersList from "@/resource_management/resource_manager/resource_list.vue"
import SearchFilter from "@/resource_management/resource_manager/search_bar.vue"

const pageContext = inject("pageContext") as PageContext<"deserialized", "consultations">
const { pageProps } = pageContext
const userProfile = pageProps.userProfile as DeserializedUserProfile

RoleFetcher.initialize("/api")
UserFetcher.initialize("/api")
DepartmentFetcher.initialize("/api")

provide("managerKind", new Manager(userProfile))

const users = ref<DeserializedUserResource[]>([])
const filteredList = ref<DeserializedUserResource[]>([])

function getFilteredList(resource: PossibleResources[]) {
	filteredList.value = resource as DeserializedUserResource[]
}

const currentUserProfile = userProfile.data
const currentUserDepartment = currentUserProfile.department.data

onMounted(() => {
	new UserFetcher().list({
		"filter": {
			"department": currentUserDepartment.id,
			"existence": "exists",
			"kind": "*",
			"role": "*",
			"slug": ""
		},
		"page": {
			"limit": 10,
			"offset": 0
		},
		"sort": [ "name" ]
	}).then(({ "body": deserializedUserList }) => {
		users.value = deserializedUserList.data
	})
})

</script>
