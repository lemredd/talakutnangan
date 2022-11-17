<template>
	<ResourceManager
		v-model:chosen-sort="chosenSort"
		v-model:slug="slug"
		v-model:existence="existence"
		:sort-names="sortNames"
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
				v-model:selectedIDs="selectedIDs"
				:template-path="READ_TAG"
				:headers="headers"
				:list="tableData"
				:may-edit="mayEditTag"/>
			<PageCounter
				v-model="offset"
				:max-count="resourceCount"
				class="centered-page-counter"/>
		</template>
	</ResourceManager>
</template>

<style scoped lang="scss">
	@import "@styles/btn.scss";

	.centered-page-counter {
		@apply mt-4;
		@apply flex justify-center;
	}
</style>

<script setup lang="ts">
import { inject, ref, computed, watch } from "vue"

import type { PageContext } from "$/types/renderer"
import type { ResourceCount } from "$/types/documents/base"
import type { TableData, OptionInfo } from "$@/types/component"
import type { DeserializedTagListDocument } from "$/types/documents/tag"

import { READ_TAG } from "$/constants/template_page_paths"
import { DEFAULT_LIST_LIMIT } from "$/constants/numerical"
import { DEBOUNCED_WAIT_DURATION } from "$@/constants/time"

import Fetcher from "$@/fetchers/tag"
import debounce from "$@/helpers/debounce"
import makeManagementInfo from "@/tag/make_management_info"
import loadRemainingResource from "$@/helpers/load_remaining_resource"
import resourceTabInfos from "@/resource_management/resource_tab_infos"
import extractAllErrorDetails from "$@/helpers/extract_all_error_details"

import { tag as permissionGroup } from "$/permissions/permission_list"
import { CREATE, UPDATE, ARCHIVE_AND_RESTORE } from "$/permissions/tag_combinations"

import PageCounter from "@/helpers/page_counter.vue"
import TabbedPageHeader from "@/helpers/tabbed_page_header.vue"
import ResourceManager from "@/resource_management/resource_manager.vue"
import ReceivedErrors from "@/helpers/message_handlers/received_errors.vue"
import ResourceList from "@/resource_management/resource_manager/resource_list.vue"

type RequiredExtraProps = "tags" | "roles"
const pageContext = inject("pageContext") as PageContext<"deserialized", RequiredExtraProps>
const { pageProps } = pageContext

const selectedIDs = ref<string[]>([])
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

const isLoaded = ref<boolean>(true)
const fetcher = new Fetcher()

const headers = [ "Name" ]
const list = ref<DeserializedTagListDocument>(pageProps.tags as DeserializedTagListDocument)
const tableData = computed<TableData[]>(() => {
	const data = list.value.data.map(resource => {
		const managementInfo = makeManagementInfo(userProfile, resource)
		return {
			"data": [
				resource.name
			],
			"id": resource.id,
			"mayArchive": managementInfo.mayArchiveTag,
			"mayEdit": managementInfo.mayArchiveTag
				|| managementInfo.mayRestoreTag,
			"mayRestore": managementInfo.mayRestoreTag
		}
	})

	return data
})

const sortNames = computed<OptionInfo[]>(() => [
	{
		"label": "Ascending by name",
		"value": "name"
	},
	{
		"label": "Descending by name",
		"value": "-name"
	}
])
const chosenSort = ref("name")
const slug = ref<string>("")
const existence = ref<"exists"|"archived"|"*">("exists")

const offset = ref(0)
const resourceCount = computed<number>(() => {
	const castedResourceListMeta = list.value.meta as ResourceCount
	return castedResourceListMeta.count
})

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
			"offset": offset.value
		},
		"sort": [ chosenSort.value ]
	}), {
		"mayContinue": () => Promise.resolve(false)
	})
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

const debouncedResetList = debounce(refetchTags, DEBOUNCED_WAIT_DURATION)

function clearOffset() {
	offset.value = 0
	debouncedResetList()
}

watch([ offset ], debouncedResetList)
watch([ chosenSort, slug, existence ], clearOffset)
</script>
