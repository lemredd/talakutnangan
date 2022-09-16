<template>
	<AdminConfigHeader v-if="currentResourceManager.isAdmin()" :title="determineTitle"/>
	<h1 v-else class="resource-config-header">
		{{ determineTitle }}
	</h1>

	<UsersManager :resource="users" @filter-by-role="filterByRole">
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
import { computed, inject, onMounted, provide, ref, watch } from "vue"

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
const userProfile = pageProps.userProfile as DeserializedUserProfile<"roles" | "department">
const currentResourceManager = new Manager(userProfile)
const currentUserDepartment = userProfile.data.department.data

provide("managerKind", new Manager(userProfile))
if (currentResourceManager.isAdmin()) {
	const tabs = [
		{
			"label": "Users",
			"path": "/user/list"
		},
		{
			"label": "Roles",
			"path": "/role/list"
		},
		{
			"label": "Departments",
			"path": "/department/list"
		}
	]
	provide("tabs", tabs)
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

const roleId = ref("*")
const depId = ref("*")
const windowOffset = ref(0)

function getFilteredList(resource: PossibleResources[]) {
	filteredList.value = resource as DeserializedUserResource[]
}

function fetchUserInfo() {
	new UserFetcher().list({
		"filter": {
			"department": currentResourceManager.isAdmin() ? depId.value : currentUserDepartment.id,
			"existence": "exists",
			"kind": "*",
			"role": roleId.value,
			"slug": ""
		},
		"page": {
			"limit": 10,
			"offset": windowOffset.value
		},
		"sort": [ "name" ]
	}).then(({ "body": deserializedUserList }) => {
		const deserializedData = deserializedUserList.data as DeserializedUserResource[]
		const offsetIncrement = 10

		if (!deserializedData.length) return Promise.resolve()

		users.value = deserializedData

		// eslint-disable-next-line no-use-before-define
		windowOffset.value += offsetIncrement

		return Promise.resolve()
	})
}

function filterByRole(id: string) {
	roleId.value = id
	windowOffset.value = 0
}

onMounted(() => {
	fetchUserInfo()
})
watch(roleId, () => {
	fetchUserInfo()
})
watch(windowOffset, () => {
	fetchUserInfo()
})
</script>
