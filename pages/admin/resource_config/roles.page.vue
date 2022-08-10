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

import type { PossibleResources } from "$@/types/independent"
import type { DeserializedRoleResource } from "$/types/documents/role"
import type { PageContext } from "#/types"
import type { DeserializedUserProfile } from "$/types/documents/user"

import RoleFetcher from "$@/fetchers/role"
import AdminSettingsHeader from "@/tabbed_page_header.vue"
import Manager from "@/resource_management/manager"
import RolesManager from "@/resource_management/resource_manager.vue"
import SearchFilter from "@/resource_management/resource_manager/search_bar.vue"
import RolesList from "@/resource_management/resource_manager/resource_list.vue"

const pageContext = inject("pageContext") as PageContext

provide("managerKind", new Manager(pageContext.pageProps.userProfile! as DeserializedUserProfile))
provide("tabs", ["Users", "Roles", "Roles"])

RoleFetcher.initialize("/api")
const fetcher = new RoleFetcher()

const roles = ref<DeserializedRoleResource[]>([])
const filteredList = ref<DeserializedRoleResource[]>([])

function getFilteredList(resource: PossibleResources[]) {
	filteredList.value = resource as DeserializedRoleResource[]
}
async function fetchRoleInfos(offset: number) {
	await fetcher.list({
		filter: {
			existence: "exists",
			department: "*"
		},
		page: {
			limit: 10,
			offset,
		},
		sort: ["name"]
	}).then(response => {
		const deserializedData = response.body.data as DeserializedRoleResource[]
		const IDsToCount = deserializedData.map(data => data.id)

		if (deserializedData.length === 0) return

		roles.value = [ ...roles.value, ...deserializedData ]

		return countUsersPerRole(IDsToCount)
	})
}

async function countUsersPerRole(IDsToCount: number[]) {
	await fetcher.countUsers(IDsToCount).then(response => {
		const deserializedData = response.body.data
		const originalData = [ ...roles.value ]

		for (const identifierData of deserializedData) {
			const { id, meta } = identifierData

			const index = originalData.findIndex(data => data.id === id)
			originalData[index].meta = meta
		}

		roles.value = originalData

		return fetchRoleInfos(originalData.length)
	})
}

onMounted(async () => {
	await fetchRoleInfos(0)
})
</script>
