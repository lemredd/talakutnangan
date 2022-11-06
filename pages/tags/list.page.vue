<template>
	<ResourceManager
j		v-model:slug="slug"
		v-model:existence="existence"
		:is-loaded="isLoaded"
		:department-names="[]"
		:tag-names="[]">
		<template #header>
			<TabbedPageHeader title="Admin Configuration" :tab-infos="resourceTabInfos">
				<template #additional-controls>
					<a
						v-if="mayCreateTag"
						href="/tag/create"
						class="add-tag-btn btn btn-primary">
						Add tag
					</a>
				</template>
			</TabbedPageHeader>
		</template>
		<template #resources>
			<ResourceList :filtered-list="list" :may-edit="mayEdittag"/>
		</template>
	</ResourceManager>
</template>

<style>
</style>

<script setup lang="ts">
import { inject, onMounted, ref, computed, watch } from "vue"

import type { PageContext } from "$/types/renderer"
import type { OptionInfo } from "$@/types/component"
import type { DeserializedTagResource } from "$/types/documents/tag"
import type { DeserializedDepartmentListDocument } from "$/types/documents/department"

import { tag as permissionGroup } from "$/permissions/permission_list"
import { CREATE, UPDATE, ARCHIVE_AND_RESTORE } from "$/permissions/tag_combinations"
import { DEBOUNCED_WAIT_DURATION } from "$@/constants/time"
import resourceTabInfos from "@/resource_management/resource_tab_infos"

import Fetcher from "$@/fetchers/tag"
import debounce from "$@/helpers/debounce"
import loadRemainingDepartments from "@/resource_management/load_remaining_departments"

import TabbedPageHeader from "@/helpers/tabbed_page_header.vue"
import ResourceManager from "@/resource_management/resource_manager.vue"
import ResourceList from "@/resource_management/resource_manager/resource_list.vue"

type RequiredExtraProps = "tags"
const pageContext = inject("pageContext") as PageContext<"deserialized", RequiredExtraProps>
const { pageProps } = pageContext

const fetcher = new Fetcher()
const isLoaded = ref<boolean>(false)
const list = ref<DeserializedTagResource[]>(pageProps.tags.data as DeserializedTagResource[])

const slug = ref<string>("")
const existence = ref<"exists"|"archived"|"*">("exists")
async function countPostsPerTag(IDsToCount: string[]) {
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
async function fetchTagInfos(): Promise<number|void> {
	await fetcher.list({
		"filter": {
			"department": chosenDepartment.value,
			"existence": existence.value,
			"slug": slug.value
		},
		"page": {
			"limit": 10,
			"offset": list.value.length
		},
		"sort": [ "name" ]
	}).then(response => {
		isLoaded.value = true
		const deserializedData = response.body.data as DeserializedTagResource[]
		const IDsToCount = deserializedData.map(data => data.id)

		if (deserializedData.length === 0) return Promise.resolve()

		list.value = [ ...list.value, ...deserializedData ]

		// eslint-disable-next-line no-use-before-define
		return countPostsPerTag(IDsToCount)
	})
}
</script>
