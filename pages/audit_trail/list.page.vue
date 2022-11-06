<template>
	<ResourceManager
		v-if="true"
		v-model:slug="slug"
		v-model:existence="existence"
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
			<ResourceList :filtered-list="list" :may-edit="false"/>
		</template>
	</ResourceManager>
</template>

<style scoped lang="scss">
	@import "@styles/btn.scss";
</style>

<script setup lang="ts">
import { onMounted, inject, ref, watch } from "vue"

import type { PageContext } from "$/types/renderer"
import type { DeserializedAuditTrailResource } from "$/types/documents/audit_trail"

import { DEBOUNCED_WAIT_DURATION } from "$@/constants/time"

import debounce from "$@/helpers/debounce"
import Fetcher from "$@/fetchers/audit_trail"
import resourceTabInfos from "@/resource_management/resource_tab_infos"

import TabbedPageHeader from "@/helpers/tabbed_page_header.vue"
import ResourceManager from "@/resource_management/resource_manager.vue"
import ResourceList from "@/resource_management/resource_manager/resource_list.vue"

type RequiredExtraProps =
	| "audit_trails"
const pageContext = inject("pageContext") as PageContext<"deserialized", RequiredExtraProps>
const { pageProps } = pageContext

const fetcher = new Fetcher()

const isLoaded = ref<boolean>(false)
const list = ref<DeserializedAuditTrailResource[]>(
	pageProps.audit_trails.data as DeserializedAuditTrailResource[]
)

const slug = ref<string>("")
const existence = ref<"exists"|"archived"|"*">("exists")

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
	}).then(response => {
		isLoaded.value = true
		const deserializedData = response.body.data as DeserializedAuditTrailResource[]

		if (!deserializedData.length) return Promise.resolve()

		list.value = [ ...list.value, ...deserializedData ]

		return Promise.resolve()
	})
}

const { userProfile } = pageProps

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
