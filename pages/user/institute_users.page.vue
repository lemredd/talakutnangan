<template>
	<h1 class="">{{ currentUserDepartment.fullName }}</h1>
	<UsersManager :resource="users">
		<template #search-filter>
			<SearchFilter :resource="users" @filter-resource-by-search="getFilteredList"/>
		</template>

		<Suspensible :is-loaded="!!users.length">
			<UsersList :filtered-list="filteredList" />
		</Suspensible>
	</UsersManager>

</template>

<script setup lang="ts">
import { inject, onMounted, provide, ref } from "vue"

import type { DeserializedUserResource } from "$/types/documents/user"
import type { PageContext } from "#/types"
import type { DeserializedUserProfile } from "$/types/documents/user"
import type { PossibleResources } from "$@/types/independent"

import Suspensible from "@/Suspensible.vue"
import Manager from "@/resource_management/manager"
import UsersManager from "@/resource_management/resource_manager.vue"
import UsersList from "@/resource_management/resource_manager/resource_list.vue"
import SearchFilter from "@/resource_management/resource_manager/search_bar.vue"
import RoleFetcher from "$@/fetchers/role"
import UserFetcher from "$@/fetchers/user"
import DepartmentFetcher from "$@/fetchers/department"

const pageContext = inject("pageContext") as PageContext
provide("managerKind", new Manager(pageContext.pageProps.userProfile! as DeserializedUserProfile))

// Fetcher Initializers
UserFetcher.initialize("/api")
RoleFetcher.initialize("/api")
DepartmentFetcher.initialize("/api")

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
