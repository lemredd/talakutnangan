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
					<a
						v-if="mayCreateSemester"
						href="/semester/create"
						class="add-semester-btn btn btn-primary">
						Add Semester
					</a>
				</template>
			</TabbedPageHeader>
		</template>
		<template #resources>
			<ResourceList :filtered-list="list" :may-edit="mayEditSemester"/>
		</template>
	</ResourceManager>
</template>

<style scoped lang="scss">
	@import "@styles/btn.scss";
</style>

<script setup lang="ts">
import { onMounted, inject, ref, watch, computed } from "vue"

import type { PageContext } from "$/types/renderer"
import type { DeserializedSemesterResource } from "$/types/documents/semester"

import { DEBOUNCED_WAIT_DURATION } from "$@/constants/time"
import { semester as permissionGroup } from "$/permissions/permission_list"
import { CREATE, UPDATE, ARCHIVE_AND_RESTORE } from "$/permissions/semester_combinations"

import debounce from "$@/helpers/debounce"
import Fetcher from "$@/fetchers/semester"
import resourceTabInfos from "@/resource_management/resource_tab_infos"

import TabbedPageHeader from "@/helpers/tabbed_page_header.vue"
import ResourceManager from "@/resource_management/resource_manager.vue"
import ResourceList from "@/resource_management/resource_manager/resource_list.vue"

type RequiredExtraProps =
	| "semesters"
const pageContext = inject("pageContext") as PageContext<"deserialized", RequiredExtraProps>
const { pageProps } = pageContext

const fetcher = new Fetcher()

const isLoaded = ref<boolean>(false)
const list = ref<DeserializedSemesterResource[]>(
	pageProps.semesters.data as DeserializedSemesterResource[]
)

const slug = ref<string>("")
const existence = ref<"exists"|"archived"|"*">("exists")

async function fetchSemesterInfos() {
	await fetcher.list({
		"filter": {
			"existence": existence.value,
			"slug": slug.value
		},
		"page": {
			"limit": 10,
			"offset": list.value.length
		},
		"sort": [ "name" ]
	// eslint-disable-next-line consistent-return
	}).then(response => {
		isLoaded.value = true
		const deserializedData = response.body.data as DeserializedSemesterResource[]

		if (!deserializedData.length) return Promise.resolve()

		list.value = [ ...list.value, ...deserializedData ]

		return Promise.resolve()
	})
}

const { userProfile } = pageProps

const mayCreateSemester = computed<boolean>(() => {
	const roles = userProfile.data.roles.data
	const isPermitted = permissionGroup.hasOneRoleAllowed(roles, [
		CREATE
	])

	return isPermitted
})

const mayEditSemester = computed<boolean>(() => {
	const roles = userProfile.data.roles.data
	const isPermitted = permissionGroup.hasOneRoleAllowed(roles, [
		UPDATE,
		ARCHIVE_AND_RESTORE
	])

	return isPermitted
})

async function refetchSemester() {
	list.value = []
	isLoaded.value = false
	await fetchSemesterInfos()
}

watch([ slug, existence ], debounce(refetchSemester, DEBOUNCED_WAIT_DURATION))

onMounted(() => {
	isLoaded.value = true
})
</script>