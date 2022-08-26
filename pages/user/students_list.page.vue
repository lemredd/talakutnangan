<template>
	<h1 class="text-2xl m-2 dark:text-light-200">Students of {{ currentUserDepartment.fullName }}</h1>
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

import type { PageContext } from "$/types/renderer"
import type { PossibleResources } from "$@/types/independent"
import type { DeserializedUserProfile, DeserializedUserResource } from "$/types/documents/user"

import RoleFetcher from "$@/fetchers/role"
import UserFetcher from "$@/fetchers/user"
import Suspensible from "@/suspensible.vue"
import Manager from "$/helpers/manager"
import UsersManager from "@/resource_management/resource_manager.vue"
import UsersList from "@/resource_management/resource_manager/resource_list.vue"
import SearchFilter from "@/resource_management/resource_manager/search_bar.vue"

RoleFetcher.initialize("/api")
UserFetcher.initialize("/api")

const pageContext = inject("pageContext") as PageContext
provide("managerKind", new Manager(pageContext.pageProps.userProfile! as DeserializedUserProfile))

const users = ref<DeserializedUserResource[]>([])
const filteredList = ref<DeserializedUserResource[]>([])
const currentUserProfile = (pageContext.pageProps.userProfile! as DeserializedUserProfile).data
const currentUserDepartment = currentUserProfile!.department.data

function getFilteredList(resource: PossibleResources[]) {
	filteredList.value = resource as DeserializedUserResource[]
}
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
