<template>
	<AdminSettingsHeader title="Admin Configuration"/>

	<UsersManager :resource="users">
		<template #search-filter>
			<SearchFilter :resource="users" @filter-resource-by-search="getFilteredList"/>
		</template>

		<UsersList :filtered-list="filteredList"/>
	</UsersManager>
</template>

<style>
</style>

<script setup lang="ts">
import { inject, onMounted, provide, ref } from "vue"

import type { PageContext } from "$/types/renderer"
import type { PossibleResources } from "$@/types/independent"
import type { DeserializedUserResource, DeserializedUserProfile } from "$/types/documents/user"

import Manager from "$/helpers/manager"
import AdminSettingsHeader from "@/tabbed_page_header.vue"
import UsersManager from "@/resource_management/resource_manager.vue"
import SearchFilter from "@/resource_management/resource_manager/search_bar.vue"
import UsersList from "@/resource_management/resource_manager/resource_list.vue"

import UserFetcher from "$@/fetchers/user"
import RoleFetcher from "$@/fetchers/role"
import DepartmentFetcher from "$@/fetchers/department"

const pageContext = inject("pageContext") as PageContext<"deserialized", "consultations">
const { pageProps } = pageContext
const userProfile = pageProps.userProfile as DeserializedUserProfile

provide("managerKind", new Manager(userProfile))
provide("tabs", [ "Users", "Roles", "Departments" ])

UserFetcher.initialize("/api")
RoleFetcher.initialize("/api")
DepartmentFetcher.initialize("/api")

const users = ref<DeserializedUserResource[]>([])
const filteredList = ref<DeserializedUserResource[]>([])

function getFilteredList(resource: PossibleResources[]) {
	filteredList.value = resource as DeserializedUserResource[]
}

const searchFilter = ref("")
onMounted(() => {
	const currentUserProfile = pageContext.pageProps.userProfile as DeserializedUserProfile
	const currentUserDepartment = currentUserProfile.data.department.data.id

	new UserFetcher().list({
		"filter": {
			"department": currentUserDepartment,
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
