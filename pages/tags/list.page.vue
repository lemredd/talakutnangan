<template>
	<ResourceManager
		v-model:slug="slug"
		v-model:existence="existence"
		:is-loaded="isLoaded">
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
			<ResourceList :filtered-list="list" :may-edit="mayEditTag"/>
		</template>
	</ResourceManager>
</template>

<style>
</style>

<script setup lang="ts">
import { inject, ref, computed } from "vue"

import type { PageContext } from "$/types/renderer"
import type { DeserializedTagResource } from "$/types/documents/tag"

import { tag as permissionGroup } from "$/permissions/permission_list"
import { CREATE, UPDATE, ARCHIVE_AND_RESTORE } from "$/permissions/tag_combinations"
import resourceTabInfos from "@/resource_management/resource_tab_infos"

import Fetcher from "$@/fetchers/tag"

import TabbedPageHeader from "@/helpers/tabbed_page_header.vue"
import ResourceManager from "@/resource_management/resource_manager.vue"
import ResourceList from "@/resource_management/resource_manager/resource_list.vue"

type RequiredExtraProps = "tags"
const pageContext = inject("pageContext") as PageContext<"deserialized", RequiredExtraProps>
const { pageProps } = pageContext

const { userProfile } = pageProps
const mayCreateTag = computed<boolean>(() => {
	const roles = userProfile.data.roles.data
	const isPermitted = permissionGroup.hasOneRoleAllowed(roles, [
		CREATE
	])

	return isPermitted
})
const mayEditTag = computed<boolean>(() => {
	const roles = userProfile.data.roles.data
	const isPermitted = permissionGroup.hasOneRoleAllowed(roles, [
		UPDATE,
		ARCHIVE_AND_RESTORE
	])

	return isPermitted
})

const fetcher = new Fetcher()
const isLoaded = ref<boolean>(true)
const list = ref<DeserializedTagResource[]>(pageProps.tags.data as DeserializedTagResource[])

const slug = ref<string>("")
const existence = ref<"exists"|"archived"|"*">("exists")

async function fetchTagInfos(): Promise<number|void> {
	await fetcher.list({
		"filter": {
			"existence": existence.value,
			"mustHavePost": false,
			"slug": slug.value
		},
		"page": {
			"limit": 10,
			"offset": list.value.length
		},
		"sort": [ "name" ]
	}).then(({ body }) => {
		const { data } = body
		isLoaded.value = true
		const deserializedData = data as DeserializedTagResource[]

		if (deserializedData.length === 0) return Promise.resolve()

		list.value = [ ...list.value, ...deserializedData ]

		return Promise.resolve()
	})
}

async function refetchTags() {
	isLoaded.value = false
	list.value = []
	await fetchTagInfos()
}
</script>
