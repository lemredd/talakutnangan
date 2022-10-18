<template>
	<AdminConfigHeader v-if="currentResourceManager.isAdmin()" :title="determineTitle"/>
	<h1 v-else class="resource-config-header">
		{{ determineTitle }}
	</h1>

	<UsersManager
		:is-loaded="isLoaded"
		:resource="users"
		:is-resource-type-user="true"
		@filter-by-role="filterByAdditionalResource($event, 'role')"
		@filter-by-dept="filterByAdditionalResource($event, 'department')">
		<template #search-filter>
			<SearchFilter @filter-by-given-slug="filterByGivenSlug"/>
		</template>

		<UsersList :filtered-list="users"/>
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
import type { DeserializedUserResource, DeserializedUserProfile } from "$/types/documents/user"

import Manager from "$/helpers/manager"
import SearchFilter from "@/helpers/search_bar.vue"
import AdminConfigHeader from "@/helpers/tabbed_page_header.vue"
import UsersManager from "@/resource_management/resource_manager.vue"
import UsersList from "@/resource_management/resource_manager/resource_list.vue"

import UserFetcher from "$@/fetchers/user"

const pageContext = inject("pageContext") as PageContext<"deserialized">
const { pageProps } = pageContext
const userProfile = pageProps.userProfile as DeserializedUserProfile<"roles" | "department">
const currentResourceManager = new Manager(userProfile)
const currentUserDepartment = userProfile.data.department.data
const isLoaded = ref(false)

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

const roleId = ref("*")
const depId = ref("*")
const windowOffset = ref(0)
const slug = ref("")
const watchableFilters = [
	roleId,
	windowOffset,
	depId,
	slug
]

function resetUsersList() {
	windowOffset.value = 0
	users.value = []
}

function filterByGivenSlug(searchInput: string) {
	resetUsersList()
	slug.value = searchInput
}

function fetchUserInfo() {
	isLoaded.value = false
	new UserFetcher().list({
		"filter": {
			"department": currentResourceManager.isAdmin() ? depId.value : currentUserDepartment.id,
			"existence": "exists",
			"kind": "*",
			"role": roleId.value,
			"slug": slug.value
		},
		"page": {
			"limit": 10,
			"offset": windowOffset.value
		},
		"sort": [ "name" ]
	}).then(({ "body": deserializedUserList }) => {
		isLoaded.value = true
		const deserializedData = deserializedUserList.data as DeserializedUserResource[]
		const offsetIncrement = 10

		if (!deserializedData.length) return Promise.resolve()

		users.value = deserializedData

		// eslint-disable-next-line no-use-before-define
		windowOffset.value += offsetIncrement

		return Promise.resolve()
	})
}

function filterByAdditionalResource(id: string, filterKind: "role" | "department") {
	resetUsersList()
	if (filterKind === "role") roleId.value = id
	else depId.value = id
}

onMounted(() => {
	fetchUserInfo()
})
watch(watchableFilters, () => {
	fetchUserInfo()
})
</script>
