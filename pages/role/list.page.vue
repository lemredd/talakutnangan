<template>
	<ResourceManager
		v-model:chosen-sort="chosenSort"
		v-model:chosen-department="chosenDepartment"
		v-model:slug="slug"
		v-model:existence="existence"
		:is-loaded="isLoaded"
		:department-names="departmentNames"
		:sort-names="sortNames">
		<template #header>
			<TabbedPageHeader title="Admin Configuration" :tab-infos="resourceTabInfos">
				<template #additional-controls>
					<a
						v-if="mayCreateRole"
						href="/role/create"
						class="add-role-btn btn btn-primary">
						Add Role
					</a>
				</template>
			</TabbedPageHeader>
		</template>
		<template #resources>
			<ReceivedErrors v-if="receivedErrors.length" :received-errors="receivedErrors"/>
			<ResourceList
				:template-path="READ_ROLE"
				:headers="headers"
				:list="tableData"
				:may-edit="mayEditRole"/>
		</template>
	</ResourceManager>
</template>

<style scoped lang="scss">
	@import "@styles/btn.scss";
</style>

<script setup lang="ts">
import { inject, onMounted, ref, computed, watch } from "vue"

import type { PageContext } from "$/types/renderer"
import type { TableData, OptionInfo } from "$@/types/component"
import type { DeserializedRoleListDocument } from "$/types/documents/role"
import type { DeserializedDepartmentListDocument } from "$/types/documents/department"

import { DEFAULT_LIST_LIMIT } from "$/constants/numerical"
import { READ_ROLE } from "$/constants/template_page_paths"
import { DEBOUNCED_WAIT_DURATION } from "$@/constants/time"

import { role as permissionGroup } from "$/permissions/permission_list"
import { CREATE, UPDATE, ARCHIVE_AND_RESTORE } from "$/permissions/role_combinations"

import Fetcher from "$@/fetchers/role"
import debounce from "$@/helpers/debounce"
import pluralize from "$/string/pluralize"
import DepartmentFetcher from "$@/fetchers/department"
import loadRemainingResource from "$@/helpers/load_remaining_resource"
import resourceTabInfos from "@/resource_management/resource_tab_infos"
import loadRemainingDepartments from "@/resource_management/load_remaining_departments"

import TabbedPageHeader from "@/helpers/tabbed_page_header.vue"
import ResourceManager from "@/resource_management/resource_manager.vue"
import extractAllErrorDetails from "$@/helpers/extract_all_error_details"
import ReceivedErrors from "@/helpers/message_handlers/received_errors.vue"
import ResourceList from "@/resource_management/resource_manager/resource_list.vue"

type RequiredExtraProps =
	| "userProfile"
	| "roles"
	| "departments"
const pageContext = inject("pageContext") as PageContext<"deserialized", RequiredExtraProps>
const { pageProps } = pageContext

const fetcher = new Fetcher()
const departmentFetcher = new DepartmentFetcher()

const headers = [ "Name", "no. of users" ]
const list = ref<DeserializedRoleListDocument>(pageProps.roles as DeserializedRoleListDocument)
const tableData = computed<TableData[]>(() => {
	const data = list.value.data.map(resource => ({
		"data": [
			resource.name,
			pluralize("user", resource.meta ? resource.meta.userCount : 0)
		],
		"id": resource.id
	}))

	return data
})

const isLoaded = ref<boolean>(true)
const sortNames = computed<OptionInfo[]>(() => [
	{
		"label": "Ascending by Name",
		"value": "name"
	},
	{
		"label": "Descending by Name",
		"value": "-name"
	}
])
const chosenSort = ref("name")

const departments = ref<DeserializedDepartmentListDocument>(
	pageProps.departments as DeserializedDepartmentListDocument
)
const chosenDepartment = ref<string>("*")
const departmentNames = computed<OptionInfo[]>(() => [
	{
		"label": "All",
		"value": "*"
	},
	...departments.value.data.map(data => ({
		"label": data.acronym,
		"value": data.id
	}))
])

const slug = ref<string>("")
const existence = ref<"exists"|"archived"|"*">("exists")
const receivedErrors = ref<string[]>([])
async function countUsersPerRole(IDsToCount: string[]) {
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

async function fetchRoleInfos(): Promise<number|void> {
	await loadRemainingResource(list, fetcher, () => ({
		"filter": {
			"department": chosenDepartment.value,
			"existence": existence.value,
			"slug": slug.value
		},
		"page": {
			"limit": DEFAULT_LIST_LIMIT,
			"offset": list.value.data.length
		},
		"sort": [ chosenSort.value ]
	}), {
		async postOperations(deserializedData) {
			const IDsToCount = deserializedData.data.map(data => data.id)
			return await countUsersPerRole(IDsToCount)
		}
	})
	.catch(responseWithErrors => extractAllErrorDetails(responseWithErrors, receivedErrors))

	isLoaded.value = true
}

const { userProfile } = pageProps

const mayCreateRole = computed<boolean>(() => {
	const roles = userProfile.data.roles.data
	const isPermitted = permissionGroup.hasOneRoleAllowed(roles, [
		CREATE,
		UPDATE,
		ARCHIVE_AND_RESTORE
	])

	return isPermitted
}
)
const mayEditRole = computed<boolean>(() => {
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
	await fetchRoleInfos()
}

watch([ chosenDepartment, slug, existence ], debounce(refetchRoles, DEBOUNCED_WAIT_DURATION))

onMounted(async() => {
	await countUsersPerRole(list.value.data.map(item => item.id))
	await loadRemainingDepartments(departments, departmentFetcher)
	isLoaded.value = true
})
</script>
