<template>
	<h1 class="">Institute Name</h1>
	<UsersManager :resource="users" :has-dropdown-filter="true"/>

</template>

<script setup lang="ts">
import { onMounted, provide, ref, inject } from "vue"
import type { DeserializedUserProfile, DeserializedUserResource } from "$/types/documents/user"
import type { PageContext } from "#/types"

import deserialize from "$/helpers/deserialize"
import Manager from "@/resource_management/manager"
import UsersManager from "@/resource_management/resource_manager.vue"
import RoleFetcher from "$@/fetchers/role"
import UserFetcher from "$@/fetchers/user"

const pageContext = inject("pageContext") as PageContext

provide("managerKind", new Manager(pageContext.pageProps.userProfile! as DeserializedUserProfile))


// Fetcher Initializers
RoleFetcher.initialize("/api")

const users = ref<DeserializedUserResource[]>([])
onMounted(() => {
const currentUserProfile = (pageContext.pageProps.userProfile! as DeserializedUserProfile).data
	const currentUserDepartment = currentUserProfile!.department.data.id

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
