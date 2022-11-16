<template>
	<ResourceManager
		v-model:chosen-sort="chosenSort"
		v-model:chosen-role="chosenRole"
		v-model:chosen-department="chosenDepartment"
		v-model:slug="slug"
		v-model:existence="existence"
		:is-loaded="isLoaded"
		:department-names="departmentNames"
		:sort-names="sortNames"
		:role-names="roleNames">
		<template #header>
			<TabbedPageHeader
				v-if="currentResourceManager.isAdmin()"
				:title="determineTitle"
				:tab-infos="resourceTabInfos">
				<template #additional-controls>
					<a
						v-if="mayCreateUser"
						href="/user/import"
						class="import-users-btn btn btn-primary">
						import
					</a>
				</template>
			</TabbedPageHeader>
			<h1 v-else class="resource-config-header">
				{{ determineTitle }}
			</h1>
		</template>

		<template #resources>
			<ReceivedErrors v-if="receivedErrors.length" :received-errors="receivedErrors"/>
			<ResourceList
				:template-path="READ_USER"
				:headers="headers"
				:list="tableData"
				:may-edit="mayEditUser"/>
			<PageCounter
				v-model="offset"
				:max-count="resourceCount"
				class="centered-page-counter"/>
		</template>
	</ResourceManager>
</template>

<style scoped lang="scss">
	@import "@styles/btn.scss";

	.resource-config-header {
		font-size: 1.75em;
		text-transform: uppercase;
	}

	.centered-page-counter {
		@apply mt-4;
		@apply flex justify-center;
	}
</style>

<script setup lang="ts">
import { computed, inject, onMounted, ref, watch, Ref } from "vue"

import type { PageContext } from "$/types/renderer"
import type { ResourceCount } from "$/types/documents/base"
import type { TableData, OptionInfo } from "$@/types/component"
import type { DeserializedRoleListDocument } from "$/types/documents/role"
import type { DeserializedDepartmentListDocument } from "$/types/documents/department"
import type { DeserializedUserListDocument, DeserializedUserProfile } from "$/types/documents/user"

import { DEFAULT_LIST_LIMIT } from "$/constants/numerical"
import { DEBOUNCED_WAIT_DURATION } from "$@/constants/time"
import { READ_USER } from "$/constants/template_page_paths"

import { user as permissionGroup } from "$/permissions/permission_list"
import {
	IMPORT_USERS,
	UPDATE_ANYONE_ON_OWN_DEPARTMENT,
	UPDATE_ANYONE_ON_ALL_DEPARTMENTS,
	ARCHIVE_AND_RESTORE_ANYONE_ON_OWN_DEPARTMENT,
	ARCHIVE_AND_RESTORE_ANYONE_ON_ALL_DEPARTMENT
} from "$/permissions/user_combinations"
import resourceTabInfos from "@/resource_management/resource_tab_infos"

import Fetcher from "$@/fetchers/user"
import Manager from "$/helpers/manager"
import debounce from "$@/helpers/debounce"
import RoleFetcher from "$@/fetchers/role"
import DepartmentFetcher from "$@/fetchers/department"
import convertForSentence from "$/string/convert_for_sentence"
import loadRemainingResource from "$@/helpers/load_remaining_resource"
import extractAllErrorDetails from "$@/helpers/extract_all_error_details"
import loadRemainingRoles from "@/resource_management/load_remaining_roles"
import loadRemainingDepartments from "@/resource_management/load_remaining_departments"

import PageCounter from "@/helpers/page_counter.vue"
import TabbedPageHeader from "@/helpers/tabbed_page_header.vue"
import ResourceManager from "@/resource_management/resource_manager.vue"
import ReceivedErrors from "@/helpers/message_handlers/received_errors.vue"
import ResourceList from "@/resource_management/resource_manager/resource_list.vue"

type RequiredExtraProps =
	| "userProfile"
	| "users"
	| "roles"
	| "departments"
const pageContext = inject("pageContext") as PageContext<"deserialized", RequiredExtraProps>
const { pageProps } = pageContext
const userProfile = pageProps.userProfile as DeserializedUserProfile<"roles" | "department">

const fetcher = new Fetcher()
const roleFetcher = new RoleFetcher()
const departmentFetcher = new DepartmentFetcher()

const currentResourceManager = new Manager(userProfile)
const currentUserDepartment = userProfile.data.department.data
const isLoaded = ref(true)

const determineTitle = computed(() => {
	if (currentResourceManager.isInstituteLimited()) {
		return `Users of ${currentUserDepartment.fullName}`
	}
	if (currentResourceManager.isStudentServiceLimited()) {
		return `Employees of ${currentUserDepartment.fullName}`
	}

	return "Administrator Configuration"
})

const headers = [ "Name", "E-mail", "Kind", "Department" ]
const list = ref<DeserializedUserListDocument<"roles"|"department">>(
	pageProps.users as DeserializedUserListDocument<"roles"|"department">
)
const tableData = computed<TableData[]>(() => {
	const data = list.value.data.map(resource => ({
		"data": [
			resource.name,
			resource.email,
			convertForSentence(resource.kind),
			resource.department.data.acronym
		],
		"id": resource.id
	}))

	return data
})

const sortNames = computed<OptionInfo[]>(() => [
	{
		"label": "Ascending by Name",
		"value": "name"
	},
	{
		"label": "Ascending by e-mail",
		"value": "email"
	},
	{
		"label": "Descending by name",
		"value": "-name"
	},
	{
		"label": "Descending by e-mail",
		"value": "-email"
	}
])
const chosenSort = ref("name")

const roles = ref<DeserializedRoleListDocument>(
	pageProps.roles as DeserializedRoleListDocument
)

const roleNames = computed<OptionInfo[]>(() => [
	{
		"label": "All",
		"value": "*"
	},
	...roles.value.data.map(data => ({
		"label": data.name,
		"value": data.id
	}))
])
const chosenRole = ref("*")

const departments = ref<DeserializedDepartmentListDocument>(
	pageProps.departments as DeserializedDepartmentListDocument
)
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
const chosenDepartment = ref("*")

const resourceCount = computed<number>(() => {
	const castedResourceListMeta = list.value.meta as ResourceCount
	return castedResourceListMeta.count
})

const offset = ref(0)
const slug = ref("")
const existence = ref<"exists"|"archived"|"*">("exists")
const receivedErrors = ref<string[]>([])
async function fetchUserInfo() {
	isLoaded.value = false
	await loadRemainingResource(list as Ref<DeserializedUserListDocument>, fetcher, () => ({
		"filter": {
			"department": currentResourceManager.isAdmin()
				? chosenDepartment.value
				: currentUserDepartment.id,
			"existence": existence.value,
			"kind": "*",
			"role": chosenRole.value,
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

const mayCreateUser = computed<boolean>(() => {
	const users = userProfile.data.roles.data
	const mayImportUsers = permissionGroup.hasOneRoleAllowed(users, [
		IMPORT_USERS
	])

	return mayImportUsers
})

// TODO: Find way to assess each user if they can be edited
const mayEditUser = computed<boolean>(() => {
	const users = userProfile.data.roles.data
	const isLimitedUpToDepartmentScope = permissionGroup.hasOneRoleAllowed(users, [
		UPDATE_ANYONE_ON_OWN_DEPARTMENT,
		ARCHIVE_AND_RESTORE_ANYONE_ON_OWN_DEPARTMENT
	])

	const isLimitedUpToGlobalScope = permissionGroup.hasOneRoleAllowed(userProfile.data.roles.data, [
		UPDATE_ANYONE_ON_ALL_DEPARTMENTS,
		ARCHIVE_AND_RESTORE_ANYONE_ON_ALL_DEPARTMENT
	])

	return isLimitedUpToDepartmentScope || isLimitedUpToGlobalScope
})

async function resetUsersList() {
	list.value = {
		"data": [],
		"meta": {
			"count": 0
		}
	}
	await fetchUserInfo()
}

const debouncedResetList = debounce(resetUsersList, DEBOUNCED_WAIT_DURATION)

function clearOffset() {
	offset.value = 0
	debouncedResetList()
}

watch([ offset ], debouncedResetList)

watch(
	[ chosenRole, slug, chosenDepartment, existence, chosenSort ],
	clearOffset
)

onMounted(async() => {
	await loadRemainingRoles(roles, roleFetcher)
	await loadRemainingDepartments(departments, departmentFetcher)
})
</script>
