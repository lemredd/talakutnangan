<template>
	<ResourceManager
		v-if="true"
		v-model:slug="slug"
		:is-loaded="isLoaded"
		:department-names="[]"
		:role-names="[]">
		<template #header>
			<TabbedPageHeader title="Admin Configuration" :tab-infos="resourceTabInfos">
				<template #additional-controls>
				</template>
			</TabbedPageHeader>
		</template>
		<template #resources>
			<ReceivedErrors v-if="receivedErrors.length" :received-errors="receivedErrors"/>
			<ResourceList
				:headers="headers"
				:list="tableData"
				:may-edit="false"/>
		</template>
	</ResourceManager>
</template>

<style scoped lang="scss">
	@import "@styles/btn.scss";
</style>

<script setup lang="ts">
import { onMounted, inject, ref, watch, computed } from "vue"

import type { PageContext } from "$/types/renderer"
import type { TableData } from "$@/types/component"
import type { DeserializedAuditTrailResource } from "$/types/documents/audit_trail"

import { DEBOUNCED_WAIT_DURATION } from "$@/constants/time"

import debounce from "$@/helpers/debounce"
import Fetcher from "$@/fetchers/audit_trail"
import resourceTabInfos from "@/resource_management/resource_tab_infos"
import extractAllErrorDetails from "$@/helpers/extract_all_error_details"
import formatToCompleteFriendlyTime from "$@/helpers/format_to_complete_friendly_time"

import TabbedPageHeader from "@/helpers/tabbed_page_header.vue"
import ResourceManager from "@/resource_management/resource_manager.vue"
import ReceivedErrors from "@/helpers/message_handlers/received_errors.vue"
import ResourceList from "@/resource_management/resource_manager/resource_list.vue"

type RequiredExtraProps =
	| "audit_trails"
const pageContext = inject("pageContext") as PageContext<"deserialized", RequiredExtraProps>
const { pageProps } = pageContext

const fetcher = new Fetcher()

const isLoaded = ref<boolean>(false)
const headers = [ "Action name", "Caused by", "Done last" ]
const list = ref<DeserializedAuditTrailResource[]>(
	pageProps.audit_trails.data as DeserializedAuditTrailResource[]
)
const tableData = computed<TableData[]>(() => {
	const data = list.value.map(resource => ({
		"data": [
			resource.actionName,
			resource.user.data.name,
			formatToCompleteFriendlyTime(resource.createdAt)
		],
		"id": resource.id
	}))

	return data
})

const slug = ref<string>("")
const existence = ref<"exists"|"archived"|"*">("exists")
const receivedErrors = ref<string[]>([])
async function fetchAuditTrailInfos() {
	await fetcher.list({
		"filter": {
			"existence": existence.value,
			"slug": slug.value
		},
		"page": {
			"limit": 10,
			"offset": list.value.length
		},
		"sort": [ "id" ]
	// eslint-disable-next-line consistent-return
	})
	.then(response => {
		const deserializedData = response.body.data as DeserializedAuditTrailResource[]

		if (!deserializedData.length) return Promise.resolve()

		list.value = [ ...list.value, ...deserializedData ]

		return Promise.resolve()
	})
	.catch(responseWithErrors => extractAllErrorDetails(responseWithErrors, receivedErrors))

	isLoaded.value = true
}

async function refetchAuditTrail() {
	list.value = []
	isLoaded.value = false
	await fetchAuditTrailInfos()
}

watch([ slug, existence ], debounce(refetchAuditTrail, DEBOUNCED_WAIT_DURATION))

onMounted(() => {
	isLoaded.value = true
})
</script>
