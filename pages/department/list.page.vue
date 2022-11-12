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
				:template-path="READ_DEPARTMENT"
				:headers="headers"
				:list="tableData"
				:may-edit="mayEditDepartment"/>
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
import type { DeserializedDepartmentListDocument } from "$/types/documents/department"

import { DEFAULT_LIST_LIMIT } from "$/constants/numerical"
import { DEBOUNCED_WAIT_DURATION } from "$@/constants/time"

import { READ_DEPARTMENT } from "$/constants/template_page_paths"
import { department as permissionGroup } from "$/permissions/permission_list"
import { CREATE, UPDATE, ARCHIVE_AND_RESTORE } from "$/permissions/department_combinations"

import debounce from "$@/helpers/debounce"
import pluralize from "$/string/pluralize"
import Fetcher from "$@/fetchers/department"
import loadRemainingResource from "$@/helpers/load_remaining_resource"
import resourceTabInfos from "@/resource_management/resource_tab_infos"
import extractAllErrorDetails from "$@/helpers/extract_all_error_details"

import TabbedPageHeader from "@/helpers/tabbed_page_header.vue"
import ResourceManager from "@/resource_management/resource_manager.vue"
import ReceivedErrors from "@/helpers/message_handlers/received_errors.vue"
import ResourceList from "@/resource_management/resource_manager/resource_list.vue"

type RequiredExtraProps =
	| "userProfile"
	| "departments"
const pageContext = inject("pageContext") as PageContext<"deserialized", RequiredExtraProps>
const { pageProps } = pageContext

const fetcher = new Fetcher()

const isLoaded = ref<boolean>(false)
const headers = [ "Name", "Acronym", "May admit", "No. of users" ]
const list = ref<DeserializedDepartmentListDocument>(
	pageProps.departments as DeserializedDepartmentListDocument
)
const tableData = computed<TableData[]>(() => {
	const data = list.value.data.map(resource => ({
		"data": [
			resource.fullName,
			resource.acronym,
			resource.mayAdmit ? "Yes" : "No",
			pluralize("user", resource.meta ? resource.meta.userCount : 0)
		],
		"id": resource.id
	}))

	return data
})

const slug = ref<string>("")
const existence = ref<"exists"|"archived"|"*">("exists")
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
	await loadRemainingResource(list, fetcher, () => ({
		"filter": {
			"existence": existence.value,
			"slug": slug.value
		},
		"page": {
			"limit": DEFAULT_LIST_LIMIT,
			"offset": list.value.data.length
		},
		"sort": [ "fullName" ]
	}), {
		async postOperations(deserializedData) {
			const IDsToCount = deserializedData.data.map(data => data.id)
			return await countUsersPerDepartment(IDsToCount)
		}
	})
	.catch(responseWithErrors => extractAllErrorDetails(responseWithErrors, receivedErrors))

	isLoaded.value = true
}

const { userProfile } = pageProps

const mayCreateDepartment = computed<boolean>(() => {
	const roles = userProfile.data.roles.data
	const isPermitted = permissionGroup.hasOneRoleAllowed(roles, [
		CREATE
	])

	return isPermitted
})

const mayEditDepartment = computed<boolean>(() => {
	const roles = userProfile.data.roles.data
	const isPermitted = permissionGroup.hasOneRoleAllowed(roles, [
		UPDATE,
		ARCHIVE_AND_RESTORE
	])

	return isPermitted
})

async function refetchRoles() {
	list.value = {
		"data": [],
		"meta": {
			"count": 0
		}
	}
	isLoaded.value = false
	await fetchDepartmentInfos()
}

watch([ slug, existence ], debounce(refetchRoles, DEBOUNCED_WAIT_DURATION))

onMounted(async() => {
	await countUsersPerDepartment(list.value.data.map(item => item.id))
	isLoaded.value = true
})
</script>
