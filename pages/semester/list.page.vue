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
						v-if="mayCreateSemester"
						href="/semester/create"
						class="add-semester-btn btn btn-primary">
						Add Semester
					</a>
				</template>
			</TabbedPageHeader>
		</template>
		<template #resources>
			<ReceivedErrors v-if="receivedErrors.length" :received-errors="receivedErrors"/>
			<ResourceList
				v-if="mayEditSemester"
				v-model:selectedIDs="selectedIDs"
				:template-path="READ_SEMESTER"
				:headers="headers"
				:list="tableData"/>
		</template>
	</ResourceManager>
</template>

<style scoped lang="scss">
	@import "@styles/btn.scss";
</style>

<script setup lang="ts">
import { onMounted, inject, ref, watch, computed, Ref } from "vue"

import type { PageContext } from "$/types/renderer"
import type { TableData, OptionInfo } from "$@/types/component"
import type { DeserializedSemesterListDocument } from "$/types/documents/semester"

import { DEBOUNCED_WAIT_DURATION } from "$@/constants/time"
import { READ_SEMESTER } from "$/constants/template_page_paths"
import { semester as permissionGroup } from "$/permissions/permission_list"
import { CREATE, UPDATE, ARCHIVE_AND_RESTORE } from "$/permissions/semester_combinations"

import { DEFAULT_LIST_LIMIT } from "$/constants/numerical"

import debounce from "$@/helpers/debounce"
import Fetcher from "$@/fetchers/semester"
import makeManagementInfo from "@/semester/make_management_info"
import loadRemainingResource from "$@/helpers/load_remaining_resource"
import resourceTabInfos from "@/resource_management/resource_tab_infos"
import extractAllErrorDetails from "$@/helpers/extract_all_error_details"
import formatToCompleteFriendlyTime from "$@/helpers/format_to_complete_friendly_time"

import TabbedPageHeader from "@/helpers/tabbed_page_header.vue"
import ResourceManager from "@/resource_management/resource_manager.vue"
import ReceivedErrors from "@/helpers/message_handlers/received_errors.vue"
import ResourceList from "@/resource_management/resource_manager/resource_list.vue"

type RequiredExtraProps =
| "userProfile"
| "semesters"
const pageContext = inject("pageContext") as PageContext<"deserialized", RequiredExtraProps>
const { pageProps } = pageContext

const selectedIDs = ref<string[]>([])

const fetcher = new Fetcher()

const { userProfile } = pageProps

const headers = [ "Name", "Order", "Start at", "End at" ]
const list = ref<DeserializedSemesterListDocument>(
	pageProps.semesters as DeserializedSemesterListDocument)

const tableData = computed<TableData[]>(() => {
	const data = list.value.data.map(resource => {
		const managementInfo = makeManagementInfo(userProfile, resource)
		return {
			"data": [
				resource.name,
				resource.semesterOrder,
				formatToCompleteFriendlyTime(resource.startAt),
				formatToCompleteFriendlyTime(resource.endAt)
			],
			"id": resource.id,
			"mayArchive": managementInfo.mayArchiveSemester,
			"mayEdit": managementInfo.mayArchiveSemester
				|| managementInfo.mayRestoreSemester,
			"mayRestore": managementInfo.mayRestoreSemester
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
		"label": "Ascending by order",
		"value": "semesterOrder"
	},
	{
		"label": "Ascending by start at",
		"value": "startAt"
	},
	{
		"label": "Ascending by end at",
		"value": "endAt"
	},
	{
		"label": "Descending by name",
		"value": "-name"
	},
	{
		"label": "Descending by order",
		"value": "-semesterOrder"
	},
	{
		"label": "Descending by start at",
		"value": "-startAt"
	},
	{
		"label": "Descending by end at",
		"value": "-endAt"
	}
])
const chosenSort = ref("name")

const isLoaded = ref<boolean>(true)
const slug = ref<string>("")
const existence = ref<"exists"|"archived"|"*">("exists")
const receivedErrors = ref<string[]>([])
async function fetchSemesterInfos() {
	await loadRemainingResource(
		list as Ref<DeserializedSemesterListDocument>,
		fetcher,
		() => ({
			"filter": {
				"existence": existence.value,
				"slug": slug.value
			},
			"page": {
				"limit": DEFAULT_LIST_LIMIT,
				"offset": list.value.data.length
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
	list.value = {
		"data": [],
		"meta": {
			"count": 0
		}
	}
	isLoaded.value = false
	await fetchSemesterInfos()
}

watch([ chosenSort, slug, existence ], debounce(refetchSemester, DEBOUNCED_WAIT_DURATION))

onMounted(() => {
	isLoaded.value = true
})
</script>
