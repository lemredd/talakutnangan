<template>
	<AdminSettingsHeader title="Admin Settings" />

	<UsersManager :resource="users">
		<template #search-filter>
			<SearchFilter :resource="users" @filter-resource-by-search="getFilteredList"/>
		</template>

		<Suspensible :is-loaded="!!users.length">
			<UsersList :filtered-list="filteredList" />
		</Suspensible>
	</UsersManager>
</template>

<style>
</style>

<script setup lang="ts">
import { inject, onMounted, provide, ref } from "vue"

import type { PossibleResources } from "$@/types/independent"
import type { DeserializedUserResource } from "$/types/documents/user"
import type { PageContext } from "#/types"
import type { DeserializedUserProfile } from "$/types/documents/user"

import Suspensible from "@/Suspensible.vue"
import Manager from "@/resource_management/manager"
import AdminSettingsHeader from "@/tabbed_page_header.vue"
import UsersManager from "@/resource_management/resource_manager.vue"
import SearchFilter from "@/resource_management/resource_manager/search_bar.vue"
import UsersList from "@/resource_management/resource_manager/resource_list.vue"

import UserFetcher from "$@/fetchers/user"
import RoleFetcher from "$@/fetchers/role"
import DepartmentFetcher from "$@/fetchers/department"
import deserialize from "$/helpers/deserialize"
const pageContext = inject("pageContext") as PageContext

provide("managerKind", new Manager(pageContext.pageProps.userProfile! as DeserializedUserProfile))
provide("tabs", ["Users", "Roles", "Departments"])

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
