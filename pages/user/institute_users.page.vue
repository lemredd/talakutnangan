<template>
	<h1 class="">
		{{ currentUserDepartment.fullName }}
	</h1>
	<UsersManager :resource="users">
		<template #search-filter>
			<SearchFilter :resource="users" @filter-resource-by-search="getFilteredList"/>
		</template>

		<UsersList :filtered-list="filteredList"/>
	</UsersManager>
</template>

<script setup lang="ts">
import { inject, onMounted, provide, ref } from "vue"

import type { PageContext } from "$/types/renderer"
import type { PossibleResources } from "$@/types/independent"
import type { DeserializedUserResource, DeserializedUserProfile } from "$/types/documents/user"

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

provide("managerKind", new Manager(pageContext.pageProps.userProfile as DeserializedUserProfile))

// Fetcher Initializers
UserFetcher.initialize("/api")
RoleFetcher.initialize("/api")
DepartmentFetcher.initialize("/api")

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
