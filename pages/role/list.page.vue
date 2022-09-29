<template>
	<AdminSettingsHeader title="Admin Configuration"/>

	<RolesManager :resource="list" :is-loaded="isLoaded">
		<template #search-filter>
			<SearchFilter
				:resource="list"
				@filter-resource-by-search="getFilteredList"/>
			<SelectableOptionsField
				v-model="chosenDepartment"
				:options="departmentNames"/>
		</template>

		<RolesList :filtered-list="list"/>
	</RolesManager>
</template>

<script setup lang="ts">
import { inject, onMounted, provide, ref, computed, watch } from "vue"

import type { PageContext } from "$/types/renderer"
import type { OptionInfo } from "$@/types/component"
import type { DeserializedRoleResource } from "$/types/documents/role"
import type { DeserializedDepartmentResource } from "$/types/documents/department"

import Manager from "$/helpers/manager"
import RoleFetcher from "$@/fetchers/role"

import AdminSettingsHeader from "@/tabbed_page_header.vue"
import SelectableOptionsField from "@/fields/selectable_options.vue"
import RolesManager from "@/resource_management/resource_manager.vue"
import SearchFilter from "@/resource_management/resource_manager/search_bar.vue"
import RolesList from "@/resource_management/resource_manager/resource_list.vue"

type RequiredExtraProps =
	| "userProfile"
	| "roles"
	| "departments"
const pageContext = inject("pageContext") as PageContext<"deserialized", RequiredExtraProps>
const { pageProps } = pageContext

const { userProfile } = pageProps

const classifier = new Manager(userProfile)
provide("managerKind", classifier)
provide("tabs", [ "Users", "Roles", "Departments" ])

RoleFetcher.initialize("/api")
const fetcher = new RoleFetcher()

const isLoaded = ref<boolean>(false)
const list = ref<DeserializedRoleResource[]>(pageProps.roles.data as DeserializedRoleResource[])
const departmentList = ref<DeserializedDepartmentResource[]>(
	pageProps.departments.data as DeserializedDepartmentResource[]
)
const chosenDepartment = ref<string>("*")
const departmentNames = computed<OptionInfo[]>(() => [
	{
		"label": "All",
		"value": "*"
	},
	...departmentList.value.map(data => ({
		"label": data.fullName,
		"value": data.id
	}))
])

async function fetchRoleInfos(offset: number): Promise<number|void> {
	await fetcher.list({
		"filter": {
			"department": chosenDepartment.value,
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

		list.value = [ ...list.value, ...deserializedData ]

		// eslint-disable-next-line no-use-before-define
		return countUsersPerRole(IDsToCount)
	})
}

async function countUsersPerRole(IDsToCount: string[]) {
	await fetcher.countUsers(IDsToCount).then(response => {
		const deserializedData = response.body.data
		const originalData = [ ...list.value ]

		for (const identifierData of deserializedData) {
			const { id, meta } = identifierData

			const index = originalData.findIndex(data => data.id === id)
			originalData[index].meta = meta
		}

		list.value = originalData

		return fetchRoleInfos(originalData.length)
	})
}

watch(chosenDepartment, () => {
	fetchRoleInfos(0)
})

onMounted(async() => {
	await countUsersPerRole(list.value.map(item => item.id))
	isLoaded.value = true
})
</script>