<template>
	<ResourceManager
		v-model:chosen-role="chosenRole"
		v-model:chosen-department="chosenDepartment"
		v-model:slug="slug"
		v-model:existence="existence"
		:is-loaded="isLoaded"
		:department-names="departmentNames"
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
			<ResourceList :filtered-list="list.data" :may-edit="mayEditUser"/>
		</template>
	</ResourceManager>
</template>

<style scoped lang="scss">
	@import "@styles/btn.scss";

	.resource-config-header {
		font-size: 1.75em;
		text-transform: uppercase;
	}
</style>

<script setup lang="ts">
import { computed, inject, onMounted, ref, watch } from "vue"

import type { PageContext } from "$/types/renderer"
import type { OptionInfo } from "$@/types/component"
import type { DeserializedRoleListDocument } from "$/types/documents/role"
import type { DeserializedDepartmentListDocument } from "$/types/documents/department"
import type { DeserializedUserListDocument, DeserializedUserProfile } from "$/types/documents/user"

import { DEBOUNCED_WAIT_DURATION } from "$@/constants/time"

import { user as permissionGroup } from "$/permissions/permission_list"
import {
	IMPORT_USERS,
	UPDATE_ANYONE_ON_OWN_DEPARTMENT,
	UPDATE_ANYONE_ON_ALL_DEPARTMENTS,
	ARCHIVE_AND_RESTORE_ANYONE_ON_OWN_DEPARTMENT,
	ARCHIVE_AND_RESTORE_ANYONE_ON_ALL_DEPARTMENT
} from "$/permissions/user_combinations"
import resourceTabInfos from "@/resource_management/resource_tab_infos"

import { DEFAULT_LIST_LIMIT } from "$/constants/numerical"

import Fetcher from "$@/fetchers/user"
import Manager from "$/helpers/manager"
import debounce from "$@/helpers/debounce"
import RoleFetcher from "$@/fetchers/role"
import DepartmentFetcher from "$@/fetchers/department"
import loadRemainingResource from "$@/helpers/load_remaining_resource"
import loadRemainingRoles from "@/resource_management/load_remaining_roles"
import loadRemainingDepartments from "@/resource_management/load_remaining_departments"

import TabbedPageHeader from "@/helpers/tabbed_page_header.vue"
import ResourceManager from "@/resource_management/resource_manager.vue"
import ResourceList from "@/resource_management/resource_manager/resource_list.vue"

type RequiredExtraProps =
	| "userProfile"
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
const isLoaded = ref(false)

const determineTitle = computed(() => {
	if (currentResourceManager.isInstituteLimited()) {
		return `Users of ${currentUserDepartment.fullName}`
	}
	if (currentResourceManager.isStudentServiceLimited()) {
		return `Employees of ${currentUserDepartment.fullName}`
	}

	return "Administrator Configuration"
})

const list = ref<DeserializedUserListDocument>({
	"data": [],
	"meta": {
		"count": 0
	}
})
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
		"label": data.fullName,
		"value": data.id
	}))
])
const chosenDepartment = ref("*")

const slug = ref("")
const existence = ref<"exists"|"archived"|"*">("exists")

async function fetchUserInfo() {
	await loadRemainingResource(list, fetcher, () => ({
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
			"offset": list.value.data.length
		},
		"sort": [ "name" ]
	}))
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
	isLoaded.value = false
	list.value = {
		"data": [],
		"meta": {
			"count": 0
		}
	}
	await fetchUserInfo()
}

onMounted(async() => {
	isLoaded.value = false
	await loadRemainingRoles(roles, roleFetcher)
	await loadRemainingDepartments(departments, departmentFetcher)
	await fetchUserInfo()

	watch(
		[ chosenRole, slug, chosenDepartment, existence ],
		debounce(resetUsersList, DEBOUNCED_WAIT_DURATION)
	)
})
</script>
