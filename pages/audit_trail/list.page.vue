<template>
	<ResourceManager
		v-model:chosen-sort="chosenSort"
		v-model:slug="slug"
		:is-loaded="isLoaded"
		:sort-names="sortNames">
		<template #header>
			<TabbedPageHeader title="Admin Configuration" :tab-infos="resourceTabInfos">
				<template #additional-controls>
				</template>
			</TabbedPageHeader>
		</template>
		<template #resources>
			<ReceivedErrors v-if="receivedErrors.length" :received-errors="receivedErrors"/>
			<ResourceList
				v-model:selectedIDs="selectedIDs"
				:headers="headers"
				:list="tableData"
				:may-edit="false"/>
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
import { inject, ref, watch, computed } from "vue"

import type { PageContext } from "$/types/renderer"
import type { TableData, OptionInfo } from "$@/types/component"
import type { ResourceCount } from "$/types/documents/base"
import type { DeserializedAuditTrailListDocument } from "$/types/documents/audit_trail"

import { DEFAULT_LIST_LIMIT } from "$/constants/numerical"
import { DEBOUNCED_WAIT_DURATION } from "$@/constants/time"

import debounce from "$@/helpers/debounce"
import Fetcher from "$@/fetchers/audit_trail"
import makeManagementInfo from "@/audit_trail/make_management_info"
import loadRemainingResource from "$@/helpers/load_remaining_resource"
import resourceTabInfos from "@/resource_management/resource_tab_infos"
import extractAllErrorDetails from "$@/helpers/extract_all_error_details"
import formatToCompleteFriendlyTime from "$@/helpers/format_to_complete_friendly_time"

import PageCounter from "@/helpers/page_counter.vue"
import TabbedPageHeader from "@/helpers/tabbed_page_header.vue"
import ResourceManager from "@/resource_management/resource_manager.vue"
import ReceivedErrors from "@/helpers/message_handlers/received_errors.vue"
import ResourceList from "@/resource_management/resource_manager/resource_list.vue"

type RequiredExtraProps =
	| "auditTrails"
const pageContext = inject("pageContext") as PageContext<"deserialized", RequiredExtraProps>
const { pageProps } = pageContext
const { userProfile } = pageProps

const fetcher = new Fetcher()

const selectedIDs = ref<string[]>([])

const headers = [ "Action name", "Caused by", "Done last" ]
const list = ref<DeserializedAuditTrailListDocument>(
	pageProps.auditTrails as DeserializedAuditTrailListDocument
)
const tableData = computed<TableData[]>(() => {
	const data = list.value.data.map(resource => {
		const unusedManagementInfo = makeManagementInfo(userProfile, resource)
		return {
			"data": [
				resource.actionName,
				resource.user.data.name,
				formatToCompleteFriendlyTime(resource.createdAt)
			],
			"id": resource.id,
			"mayArchive": false,
			"mayEdit": false,
			"mayRestore": false
		}
	})

	return data
})

const sortNames = computed<OptionInfo[]>(() => [
	{
		"label": "Ascending by creation date",
		"value": "createdAt"
	},
	{
		"label": "Ascending by action name",
		"value": "actionName"
	},
	{
		"label": "Descending by creation date",
		"value": "-createdAt"
	},
	{
		"label": "Descending by action name",
		"value": "-actionName"
	}
])
const chosenSort = ref("-createdAt")

const isLoaded = ref<boolean>(true)
const slug = ref<string>("")
const existence = ref<"exists"|"archived"|"*">("exists")
const receivedErrors = ref<string[]>([])
const castedResourceListMeta = list.value.meta as ResourceCount
const resourceCount = computed(() => castedResourceListMeta.count)
const offset = ref(0)
async function fetchAuditTrailInfos() {
	await loadRemainingResource(
		list,
		fetcher,
		() => ({
			"filter": {
				"existence": existence.value,
				"slug": slug.value
			},
			"page": {
				"limit": DEFAULT_LIST_LIMIT,
				"offset": offset.value
			},
			"sort": [ chosenSort.value ]
		}),
		{
			"mayContinue": () => Promise.resolve(false)
		}
	)
	.catch(responseWithErrors => extractAllErrorDetails(responseWithErrors, receivedErrors))
	isLoaded.value = true
}

async function refetchAuditTrail() {
	isLoaded.value = false
	list.value = {
		"data": [],
		"meta": {
			"count": 0
		}
	}
	await fetchAuditTrailInfos()
}

watch([ chosenSort, slug, existence, offset ], debounce(refetchAuditTrail, DEBOUNCED_WAIT_DURATION))
</script>
