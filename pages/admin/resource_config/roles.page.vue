<template>
	<AdminSettingsHeader title="Admin Settings" />

	<RolesManager :resource="roles">
		<template #search-filter>
			<SearchFilter :resource="roles" @filter-resource-by-search="getFilteredList"/>
		</template>

		<RolesList :filtered-list="filteredList" />
	</RolesManager>
</template>

<script setup lang="ts">
import { inject, onMounted, provide, ref } from "vue"

import type { PageContext } from "#/types"
import type { PossibleResources } from "$@/types/independent"
import type { DeserializedUserProfile } from "$/types/documents/user"
import type { DeserializedRoleResource } from "$/types/documents/role"

import RoleFetcher from "$@/fetchers/role"
import deserialize from "$/helpers/deserialize"
import Manager from "@/resource_management/manager"
import AdminSettingsHeader from "@/tabbed_page_header.vue"
import RolesManager from "@/resource_management/resource_manager.vue"
import SearchFilter from "@/resource_management/resource_manager/search_bar.vue"
import RolesList from "@/resource_management/resource_manager/resource_list.vue"

const pageContext = inject("pageContext") as PageContext

provide("managerKind", new Manager(pageContext.pageProps.userProfile! as DeserializedUserProfile))
provide("tabs", ["Users", "Roles", "Departments"])

RoleFetcher.initialize("/api")

const roles = ref<DeserializedRoleResource[]>([])
const filteredList = ref<DeserializedRoleResource[]>([])

function getFilteredList(resource: PossibleResources[]) {
	filteredList.value = resource as DeserializedRoleResource[]
}

onMounted(async () => {
	await new RoleFetcher().list({
		filter: {
			existence: "exists",
			department: "*"
		},
		page: {
			limit: 10,
			offset: 0
		},
		sort: ["name"]
	})
	.then(response => {
		const { body } = response
		const deserializedData = deserialize(body)!.data as DeserializedRoleResource[]
		roles.value = deserializedData
	})
})
</script>
