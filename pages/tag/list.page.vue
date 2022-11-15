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
						Add Tag
					</a>
				</template>
			</TabbedPageHeader>
		</template>
		<template #resources>
			<ReceivedErrors v-if="receivedErrors.length" :received-errors="receivedErrors"/>
			<ResourceList
				:template-path="READ_TAG"
				:headers="headers"
				:list="tableData"
				:may-edit="mayEditTag"/>
		</template>
	</ResourceManager>
</template>

<style>
</style>

<script setup lang="ts">
import { inject, ref, computed, watch } from "vue"

import type { PageContext } from "$/types/renderer"
import type { TableData } from "$@/types/component"
import type { DeserializedTagListDocument } from "$/types/documents/tag"

import { READ_TAG } from "$/constants/template_page_paths"
import { DEFAULT_LIST_LIMIT } from "$/constants/numerical"
import { DEBOUNCED_WAIT_DURATION } from "$@/constants/time"

import Fetcher from "$@/fetchers/tag"
import debounce from "$@/helpers/debounce"
import loadRemainingResource from "$@/helpers/load_remaining_resource"
import resourceTabInfos from "@/resource_management/resource_tab_infos"
import extractAllErrorDetails from "$@/helpers/extract_all_error_details"

import { tag as permissionGroup } from "$/permissions/permission_list"
import { CREATE, UPDATE, ARCHIVE_AND_RESTORE } from "$/permissions/tag_combinations"

import TabbedPageHeader from "@/helpers/tabbed_page_header.vue"
import ResourceManager from "@/resource_management/resource_manager.vue"
import ReceivedErrors from "@/helpers/message_handlers/received_errors.vue"
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

const headers = [ "Name" ]
const fetcher = new Fetcher()
const list = ref<DeserializedTagListDocument>(pageProps.tags as DeserializedTagListDocument)
const tableData = computed<TableData[]>(() => {
	const data = list.value.data.map(resource => ({
		"data": [
			resource.name
		],
		"id": resource.id
	}))

	return data
})

const isLoaded = ref<boolean>(true)
const slug = ref<string>("")
const existence = ref<"exists"|"archived"|"*">("exists")
const receivedErrors = ref<string[]>([])

async function fetchTagInfos(): Promise<number|void> {
	await loadRemainingResource(list, fetcher, () => ({
		"filter": {
			"existence": existence.value,
			"mustHavePost": false,
			"slug": slug.value
		},
		"page": {
			"limit": DEFAULT_LIST_LIMIT,
			"offset": list.value.data.length
		},
		"sort": [ "name" ]
	}))
	.catch(responseWithErrors => extractAllErrorDetails(responseWithErrors, receivedErrors))

	isLoaded.value = true
}

async function refetchTags() {
	isLoaded.value = false
	list.value = {
		"data": [],
		"meta": {
			"count": 0
		}
	}
	await fetchTagInfos()
}

watch([ slug, existence ], debounce(refetchTags, DEBOUNCED_WAIT_DURATION))
</script>
