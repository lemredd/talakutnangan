<template>
	<ResourceManager
		v-model:slug="slug"
		v-model:existence="existence"
		:is-loaded="isLoaded"
		:department-names="[]"
		:role-names="[]">
		<template #header>
			<TabbedPageHeader title="Admin Configuration" :tab-infos="resourceTabInfos">
				<template #additional-controls>
					<a href="/department/create" class="add-department-btn btn btn-primary">
						Add Department
					</a>
				</template>
			</TabbedPageHeader>
		</template>
		<template #resources>
			<ResourceList :filtered-list="list"/>
		</template>
	</ResourceManager>
</template>

<style scoped lang="scss">
	@import "@styles/btn.scss";
</style>

<script setup lang="ts">
import { onMounted, inject, ref, watch } from "vue"

import type { PageContext } from "$/types/renderer"
import type { DeserializedDepartmentResource } from "$/types/documents/department"

import { DEBOUNCED_WAIT_DURATION } from "$@/constants/time"

import debounce from "$@/helpers/debounce"
import Fetcher from "$@/fetchers/department"
import resourceTabInfos from "@/resource_management/resource_tab_infos"

import TabbedPageHeader from "@/helpers/tabbed_page_header.vue"
import ResourceManager from "@/resource_management/resource_manager.vue"
import ResourceList from "@/resource_management/resource_manager/resource_list.vue"

type RequiredExtraProps =
	| "userProfile"
	| "departments"
const pageContext = inject("pageContext") as PageContext<"deserialized", RequiredExtraProps>
const { pageProps } = pageContext

const fetcher = new Fetcher()

const isLoaded = ref<boolean>(false)
const list = ref<DeserializedDepartmentResource[]>(
	pageProps.departments.data as DeserializedDepartmentResource[]
)

const slug = ref<string>("")
const existence = ref<"exists"|"archived"|"*">("exists")

async function fetchDepartmentInfos(): Promise<number|void> {
	await fetcher.list({
		"filter": {
			"existence": existence.value,
			"slug": slug.value
		},
		"page": {
			"limit": 10,
			"offset": list.value.length
		},
		"sort": [ "fullName" ]
	}).then(response => {
		isLoaded.value = true
		const deserializedData = response.body.data as DeserializedDepartmentResource[]
		const IDsToCount = deserializedData.map(data => data.id)

		if (deserializedData.length === 0) return Promise.resolve()

		list.value = [ ...list.value, ...deserializedData ]

		// eslint-disable-next-line no-use-before-define
		return countUsersPerDepartment(IDsToCount)
	})
}

async function countUsersPerDepartment(IDsToCount: string[]) {
	await fetcher.countUsers(IDsToCount).then(response => {
		const deserializedData = response.body.data
		const originalData = [ ...list.value ]

		for (const identifierData of deserializedData) {
			const { id, meta } = identifierData

			const index = originalData.findIndex(data => data.id === id)
			originalData[index].meta = meta
		}

		list.value = originalData
	})

	await fetchDepartmentInfos()
}

async function refetchRoles() {
	list.value = []
	isLoaded.value = false
	await fetchDepartmentInfos()
}

watch([ slug, existence ], debounce(refetchRoles, DEBOUNCED_WAIT_DURATION))

onMounted(async() => {
	await countUsersPerDepartment(list.value.map(item => item.id))
	isLoaded.value = true
})
</script>
