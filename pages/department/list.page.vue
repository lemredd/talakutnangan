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
						v-if="mayCreateDepartment"
						href="/department/create"
						class="add-department-btn btn btn-primary">
						Add Department
					</a>
				</template>
			</TabbedPageHeader>
		</template>
		<template #resources>
			<ReceivedErrors v-if="receivedErrors.length" :received-errors="receivedErrors"/>
			<ResourceList
				v-model:selectedIDs="selectedIDs"
				:template-path="READ_DEPARTMENT"
				:headers="headers"
				:list="tableData"
				@archive="archive"
				@restore="restore"
				@batch-archive="batchArchive"
				@batch-restore="batchRestore"/>
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
import { onMounted, inject, ref, watch, computed } from "vue"

import type { Existence } from "$/types/query"
import type { PageContext } from "$/types/renderer"
import type { ResourceCount } from "$/types/documents/base"
import type { TableData, OptionInfo } from "$@/types/component"
import type { DeserializedDepartmentListDocument } from "$/types/documents/department"

import { DEFAULT_LIST_LIMIT } from "$/constants/numerical"
import { DEBOUNCED_WAIT_DURATION } from "$@/constants/time"

import { CREATE } from "$/permissions/department_combinations"
import { READ_DEPARTMENT } from "$/constants/template_page_paths"
import { department as permissionGroup } from "$/permissions/permission_list"

import debounce from "$@/helpers/debounce"
import pluralize from "$/string/pluralize"
import Fetcher from "$@/fetchers/department"
import makeManagementInfo from "@/department/make_management_info"
import loadRemainingResource from "$@/helpers/load_remaining_resource"
import resourceTabInfos from "@/resource_management/resource_tab_infos"
import extractAllErrorDetails from "$@/helpers/extract_all_error_details"
import makeExistenceOperators from "@/resource_management/make_existence_operators"

import PageCounter from "@/helpers/page_counter.vue"
import TabbedPageHeader from "@/helpers/tabbed_page_header.vue"
import ResourceManager from "@/resource_management/resource_manager.vue"
import ReceivedErrors from "@/helpers/message_handlers/received_errors.vue"
import ResourceList from "@/resource_management/resource_manager/resource_list.vue"

type RequiredExtraProps =
	| "userProfile"
	| "roles"
	| "departments"
const pageContext = inject("pageContext") as PageContext<"deserialized", RequiredExtraProps>
const { pageProps } = pageContext

const fetcher = new Fetcher()
const isLoaded = ref<boolean>(true)

const selectedIDs = ref<string[]>([])

const { userProfile } = pageProps

const headers = [ "Name", "Acronym", "May admit", "No. of users" ]
const list = ref<DeserializedDepartmentListDocument>(
	pageProps.departments as DeserializedDepartmentListDocument
)

const tableData = computed<TableData[]>(() => {
	const data = list.value.data.map(resource => {
		const managementInfo = makeManagementInfo(userProfile, resource)
		return {
			"data": [
				resource.fullName,
				resource.acronym,
				resource.mayAdmit ? "Yes" : "No",
				pluralize("user", resource.meta ? resource.meta.userCount : 0)
			],
			"id": resource.id,
			"mayArchive": managementInfo.mayArchiveDepartment,
			"mayEdit": managementInfo.mayUpdateDepartment
				|| managementInfo.mayRestoreDepartment
				|| managementInfo.mayArchiveDepartment,
			"mayRestore": managementInfo.mayRestoreDepartment
		}
	})

	return data
})

const sortNames = computed<OptionInfo[]>(() => [
	{
		"label": "Ascending by name",
		"value": "fullName"
	},
	{
		"label": "Ascending by acronym",
		"value": "acronym"
	},
	{
		"label": "Ascending by may admit",
		"value": "mayAdmit"
	},
	{
		"label": "Descending by name",
		"value": "-fullName"
	},
	{
		"label": "Descending by acronym",
		"value": "-acronym"
	},
	{
		"label": "Descending by may admit",
		"value": "-mayAdmit"
	}
])
const chosenSort = ref("fullName")
const slug = ref<string>("")
const existence = ref<Existence>("exists")

const offset = ref(0)
const resourceCount = computed<number>(() => {
	const castedResourceListMeta = list.value.meta as ResourceCount
	return castedResourceListMeta.count
})

const receivedErrors = ref<string[]>([])
async function countUsersPerDepartment(IDsToCount: string[]) {
	await fetcher.countUsers(IDsToCount).then(response => {
		const deserializedData = response.body.data
		const originalData = [ ...list.value.data ]

		for (const identifierData of deserializedData) {
			const { id, meta } = identifierData

			const index = originalData.findIndex(data => data.id === id)
			originalData[index].meta = meta
		}

		list.value = {
			...list.value,
			"data": originalData,
			"meta": list.value.meta
		}
	})
}

async function fetchDepartmentInfos(): Promise<number|void> {
	isLoaded.value = false

	await loadRemainingResource(list, fetcher, () => ({
		"filter": {
			"existence": existence.value,
			"slug": slug.value
		},
		"page": {
			"limit": DEFAULT_LIST_LIMIT,
			"offset": offset.value
		},
		"sort": [ chosenSort.value ]
	}), {
		async postOperations(deserializedData) {
			const IDsToCount = deserializedData.data.map(data => data.id)
			return await countUsersPerDepartment(IDsToCount)
		}
	})
	.catch(responseWithErrors => extractAllErrorDetails(responseWithErrors, receivedErrors))

	isLoaded.value = true
}

const mayCreateDepartment = computed<boolean>(() => {
	const roles = userProfile.data.roles.data
	const isPermitted = permissionGroup.hasOneRoleAllowed(roles, [
		CREATE
	])

	return isPermitted
})

async function refetchDepartment() {
	list.value = {
		"data": [],
		"meta": {
			"count": 0
		}
	}
	await fetchDepartmentInfos()
}

const debouncedResetList = debounce(refetchDepartment, DEBOUNCED_WAIT_DURATION)

function clearOffset() {
	offset.value = 0
	debouncedResetList()
}

watch([ offset ], debouncedResetList)
watch([ chosenSort, slug, existence ], clearOffset)
const {
	archive,
	batchArchive,
	batchRestore,
	restore
} = makeExistenceOperators(
	list,
	fetcher,
	{
		existence,
		offset
	},
	selectedIDs,
	{
		isLoaded,
		receivedErrors
	}
)

onMounted(async() => {
	await countUsersPerDepartment(list.value.data.map(item => item.id))
	isLoaded.value = true
})
</script>
