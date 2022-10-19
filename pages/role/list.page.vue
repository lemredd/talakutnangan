<template>
	<ResourceManager
		v-model:chosen-department="chosenDepartment"
		v-model:slug="slug"
		:is-loaded="isLoaded"
		:department-names="departmentNames"
		:role-names="[]">
		<template #header>
			<TabbedPageHeader title="Admin Configuration" :tab-infos="resourceTabInfos"/>
		</template>
		<template #resources>
			<ResourceList :filtered-list="list"/>
		</template>
	</ResourceManager>
</template>

<script setup lang="ts">
import { inject, onMounted, ref, computed, watch } from "vue"

import type { PageContext } from "$/types/renderer"
import type { OptionInfo } from "$@/types/component"
import type { ResourceCount } from "$/types/documents/base"
import type { DeserializedRoleResource } from "$/types/documents/role"
import type { DeserializedDepartmentResource } from "$/types/documents/department"

import { DEBOUNCED_WAIT_DURATION } from "$@/constants/time"
import resourceTabInfos from "@/resource_management/resource_tab_infos"

import Fetcher from "$@/fetchers/role"
import debounce from "$@/helpers/debounce"
import DepartmentFetcher from "$@/fetchers/department"

import TabbedPageHeader from "@/helpers/tabbed_page_header.vue"
import ResourceManager from "@/resource_management/resource_manager.vue"
import ResourceList from "@/resource_management/resource_manager/resource_list.vue"

type RequiredExtraProps =
	| "userProfile"
	| "roles"
	| "departments"
const pageContext = inject("pageContext") as PageContext<"deserialized", RequiredExtraProps>
const { pageProps } = pageContext

const fetcher = new Fetcher()
const departmentFetcher = new DepartmentFetcher()

const isLoaded = ref<boolean>(false)
const list = ref<DeserializedRoleResource[]>(pageProps.roles.data as DeserializedRoleResource[])
const departments = ref<DeserializedDepartmentResource[]>(
	pageProps.departments.data as DeserializedDepartmentResource[]
)
const chosenDepartment = ref<string>("*")
const departmentNames = computed<OptionInfo[]>(() => [
	{
		"label": "All",
		"value": "*"
	},
	...departments.value.map(data => ({
		"label": data.fullName,
		"value": data.id
	}))
])

const slug = ref<string>("")

async function fetchRoleInfos(): Promise<number|void> {
	await fetcher.list({
		"filter": {
			"department": chosenDepartment.value,
			"existence": "exists",
			"slug": slug.value
		},
		"page": {
			"limit": 10,
			"offset": list.value.length
		},
		"sort": [ "name" ]
	}).then(response => {
		isLoaded.value = true
		const deserializedData = response.body.data as DeserializedRoleResource[]
		const IDsToCount = deserializedData.map(data => data.id)

		if (deserializedData.length === 0) return Promise.resolve()

		list.value = [ ...list.value, ...deserializedData ]

		// eslint-disable-next-line no-use-before-define
		return countUsersPerRole(IDsToCount)
	})
}

// TODO: Share this among resource pages
async function fetchDepartmentInfos(): Promise<number|void> {
	await departmentFetcher.list({
		"filter": {
			"existence": "exists",
			"slug": ""
		},
		"page": {
			"limit": 10,
			"offset": departments.value.length
		},
		"sort": [ "fullName" ]
	}).then(response => {
		const { data, meta } = response.body

		if (data.length === 0) return Promise.resolve()

		departments.value = [ ...departments.value, ...data ]

		const castMeta = meta as ResourceCount
		if (departments.value.length < castMeta.count) {
			return fetchDepartmentInfos()
		}

		return Promise.resolve()
	})
}

async function countUsersPerRole(IDsToCount: string[]) {
	await fetcher.countUsers(IDsToCount).then(response => {
		const deserializedData = response.body.data

		for (const identifierData of deserializedData) {
			const { id, meta } = identifierData

			const index = list.value.findIndex(data => data.id === id)

			if (index > -1) {
				list.value[index].meta = meta
			}
		}
	})
	await fetchRoleInfos()
}

async function refetchRoles() {
	list.value = []
	isLoaded.value = false
	await fetchRoleInfos()
}

watch([ chosenDepartment, slug ], debounce(refetchRoles, DEBOUNCED_WAIT_DURATION))

onMounted(async() => {
	await countUsersPerRole(list.value.map(item => item.id))
	await fetchDepartmentInfos()
	isLoaded.value = true
})
</script>
