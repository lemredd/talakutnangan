<template>
	<AdminSettingsHeader title="Admin Configuration"/>

	<RolesManager :resource="roles" :is-loaded="isLoaded">
		<template #search-filter>
			<SearchFilter :resource="roles" @filter-resource-by-search="getFilteredList"/>
		</template>

		<RolesList :filtered-list="filteredList"/>
	</RolesManager>
</template>

<script setup lang="ts">
import { inject, onMounted, provide, ref } from "vue"

import type { PageContext } from "$/types/renderer"
import type { PossibleResources } from "$@/types/independent"
import type { DeserializedRoleResource } from "$/types/documents/role"

import RoleFetcher from "$@/fetchers/role"
import Manager from "$/helpers/manager"

import AdminSettingsHeader from "@/tabbed_page_header.vue"
import RolesManager from "@/resource_management/resource_manager.vue"
import SearchFilter from "@/resource_management/resource_manager/search_bar.vue"
import RolesList from "@/resource_management/resource_manager/resource_list.vue"

type RequiredExtraProps =
	| "userProfile"
	| "roles"
const pageContext = inject("pageContext") as PageContext<"deserialized", RequiredExtraProps>
const { pageProps } = pageContext

const { userProfile } = pageProps

provide("managerKind", new Manager(userProfile))
provide("tabs", [ "Users", "Roles", "Roles" ])

RoleFetcher.initialize("/api")
const fetcher = new RoleFetcher()

const isLoaded = ref<boolean>(true)
const roles = ref<DeserializedRoleResource[]>(pageProps.roles.data as DeserializedRoleResource[])
const filteredList = ref<DeserializedRoleResource[]>([])

function getFilteredList(resource: PossibleResources[]) {
	filteredList.value = resource as DeserializedRoleResource[]
}
async function fetchRoleInfos(offset: number): Promise<number|void> {
	await fetcher.list({
		"filter": {
			"department": "*",
			"existence": "exists"
		},
		"page": {
			"limit": 10,
			offset
		},
		"sort": [ "name" ]
	}).then(response => {
		const deserializedData = response.body.data as DeserializedRoleResource[]
		const IDsToCount = deserializedData.map(data => data.id)

		if (deserializedData.length === 0) return Promise.resolve()

		roles.value = [ ...roles.value, ...deserializedData ]

		// eslint-disable-next-line no-use-before-define
		return countUsersPerRole(IDsToCount)
	})
}

async function countUsersPerRole(IDsToCount: string[]) {
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

onMounted(async() => {
	// await fetchRoleInfos(0)
})
</script>
