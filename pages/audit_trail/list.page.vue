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
			<ResourceList :filtered-list="list.data" :may-edit="false"/>
			<PageCounter
				v-model="offset"
				:max-count="resourceCount"/>
		</template>
	</ResourceManager>
</template>

<style scoped lang="scss">
	@import "@styles/btn.scss";
</style>

<script setup lang="ts">
import { inject, ref, watch, computed } from "vue"

import type { PageContext } from "$/types/renderer"
import type { ResourceCount } from "$/types/documents/base"
import type { DeserializedAuditTrailListDocument } from "$/types/documents/audit_trail"

import { DEBOUNCED_WAIT_DURATION } from "$@/constants/time"

import debounce from "$@/helpers/debounce"
import Fetcher from "$@/fetchers/audit_trail"
import loadRemainingResource from "$@/helpers/load_remaining_resource"
import resourceTabInfos from "@/resource_management/resource_tab_infos"
import extractAllErrorDetails from "$@/helpers/extract_all_error_details"


import PageCounter from "@/helpers/page_counter.vue"
import TabbedPageHeader from "@/helpers/tabbed_page_header.vue"
import ResourceManager from "@/resource_management/resource_manager.vue"
import ReceivedErrors from "@/helpers/message_handlers/received_errors.vue"
import ResourceList from "@/resource_management/resource_manager/resource_list.vue"

type RequiredExtraProps =
	| "auditTrails"
const pageContext = inject("pageContext") as PageContext<"deserialized", RequiredExtraProps>
const { pageProps } = pageContext

const fetcher = new Fetcher()
const list = ref(
	pageProps.auditTrails as DeserializedAuditTrailListDocument
)
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
				"limit": 10,
				"offset": offset.value
			},
			"sort": [ "-createdAt" ]
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

watch([ slug, existence, offset ], debounce(refetchAuditTrail, DEBOUNCED_WAIT_DURATION))
</script>
