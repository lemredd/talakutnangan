<template>
	<AdminConfigHeader v-if="currentResourceManager.isAdmin()" :title="determineTitle"/>
	<h1 v-else class="resource-config-header">
		{{ determineTitle }}
	</h1>

	<UsersManager :resource="users">
		<template #search-filter>
			<SearchFilter :resource="users" @filter-resource-by-search="getFilteredList"/>
		</template>

		<UsersList :filtered-list="filteredList"/>
	</UsersManager>
</template>

<style scoped lang="scss">

.resource-config-header {
	font-size: 1.75em;
	text-transform: uppercase;
}
</style>
<script setup lang="ts">
import { computed, inject, onMounted, provide, ref } from "vue"

import type { PageContext } from "$/types/renderer"
import type { PossibleResources } from "$@/types/independent"
import type { DeserializedUserResource, DeserializedUserProfile } from "$/types/documents/user"

import Manager from "$/helpers/manager"
import AdminConfigHeader from "@/tabbed_page_header.vue"
import UsersManager from "@/resource_management/resource_manager.vue"
import SearchFilter from "@/resource_management/resource_manager/search_bar.vue"
import UsersList from "@/resource_management/resource_manager/resource_list.vue"

import UserFetcher from "$@/fetchers/user"
import RoleFetcher from "$@/fetchers/role"
import DepartmentFetcher from "$@/fetchers/department"

const pageContext = inject("pageContext") as PageContext<"deserialized">
const { pageProps } = pageContext
const userProfile = pageProps.userProfile as DeserializedUserProfile
const currentResourceManager = new Manager(userProfile)
const currentUserDepartment = userProfile.data.department.data

if (currentResourceManager.isAdmin()) {
	provide("managerKind", new Manager(userProfile))
	provide("tabs", [ "Users", "Roles", "Departments" ])
}

UserFetcher.initialize("/api")
RoleFetcher.initialize("/api")
DepartmentFetcher.initialize("/api")

const determineTitle = computed(() => {
	if (currentResourceManager.isInstituteLimited()) {
		return `Users of ${currentUserDepartment.fullName}`
	}
	if (currentResourceManager.isStudentServiceLimited()) {
		return `Employees of ${currentUserDepartment.fullName}`
	}

	return "Administrator Configuration"
})

const users = ref<DeserializedUserResource[]>([])
const filteredList = ref<DeserializedUserResource[]>([])

function getFilteredList(resource: PossibleResources[]) {
	filteredList.value = resource as DeserializedUserResource[]
}

onMounted(() => {
	new UserFetcher().list({
		"filter": {
			"department": currentResourceManager.isAdmin() ? "*" : currentUserDepartment.id,
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
