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
			<ResourceList :filtered-list="list" :may-edit="mayEditUser"/>
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
import type { DeserializedRoleResource } from "$/types/documents/role"
import type { DeserializedDepartmentResource } from "$/types/documents/department"
import type { DeserializedUserResource, DeserializedUserProfile } from "$/types/documents/user"

import { user as permissionGroup } from "$/permissions/permission_list"
import {
	IMPORT_USERS,
	UPDATE_ANYONE_ON_OWN_DEPARTMENT,
	UPDATE_ANYONE_ON_ALL_DEPARTMENTS,
	ARCHIVE_AND_RESTORE_ANYONE_ON_OWN_DEPARTMENT,
	ARCHIVE_AND_RESTORE_ANYONE_ON_ALL_DEPARTMENT
} from "$/permissions/user_combinations"
import { DEBOUNCED_WAIT_DURATION } from "$@/constants/time"
import resourceTabInfos from "@/resource_management/resource_tab_infos"

import Fetcher from "$@/fetchers/user"
import Manager from "$/helpers/manager"
import debounce from "$@/helpers/debounce"
import RoleFetcher from "$@/fetchers/role"
import DepartmentFetcher from "$@/fetchers/department"
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

const list = ref<DeserializedUserResource[]>([])
const roles = ref<DeserializedRoleResource[]>(
	pageProps.roles.data as DeserializedRoleResource[]
)
const roleNames = computed<OptionInfo[]>(() => [
	{
		"label": "All",
		"value": "*"
	},
	...roles.value.map(data => ({
		"label": data.name,
		"value": data.id
	}))
])
const chosenRole = ref("*")

const departments = ref<DeserializedDepartmentResource[]>(
	pageProps.departments.data as DeserializedDepartmentResource[]
)
const departmentNames = computed<OptionInfo[]>(() => [
	{
		"label": "All",
		"value": "*"
	},
	...departments.value.map(data => ({
		"label": data.fullName,
		"value": data.id
	}))
])
const chosenDepartment = ref("*")

const slug = ref("")
const existence = ref<"exists"|"archived"|"*">("exists")

function fetchUserInfo() {
	fetcher.list({
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
			"limit": 10,
			"offset": list.value.length
		},
		"sort": [ "name" ]
	}).then(({ "body": deserializedUserList }) => {
		isLoaded.value = true
		const deserializedData = deserializedUserList.data as DeserializedUserResource[]

		if (!deserializedData.length) return Promise.resolve()

		list.value = [ ...list.value, ...deserializedData ]

		return Promise.resolve()
	})
}

const mayCreateUser = computed<boolean>(() => {
	const users = userProfile.data.roles.data
	const mayImportUsers = permissionGroup.hasOneRoleAllowed(users, [
		IMPORT_USERS
	])

	return mayImportUsers
})

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
	list.value = []
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
