<template>
	<ResourceManager
		v-model:chosen-department="chosenDepartment"
		v-model:slug="slug"
		v-model:existence="existence"
		:is-loaded="isLoaded"
		:department-names="departmentNames"
		:role-names="[]">
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
			<ResourceList :filtered-list="list.data" :may-edit="mayEditRole"/>
		</template>
	</ResourceManager>
</template>

<style scoped lang="scss">
	@import "@styles/btn.scss";
</style>

<script setup lang="ts">
import { inject, onMounted, ref, computed, watch } from "vue"

import type { PageContext } from "$/types/renderer"
import type { OptionInfo } from "$@/types/component"
import type { DeserializedRoleListDocument } from "$/types/documents/role"
import type { DeserializedDepartmentListDocument } from "$/types/documents/department"

import { DEFAULT_LIST_LIMIT } from "$/constants/numerical"
import { DEBOUNCED_WAIT_DURATION } from "$@/constants/time"

import { role as permissionGroup } from "$/permissions/permission_list"
import { CREATE, UPDATE, ARCHIVE_AND_RESTORE } from "$/permissions/role_combinations"

import Fetcher from "$@/fetchers/role"
import debounce from "$@/helpers/debounce"
import DepartmentFetcher from "$@/fetchers/department"
import loadRemainingResource from "$@/helpers/load_remaining_resource"
import resourceTabInfos from "@/resource_management/resource_tab_infos"
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

const fetcher = new Fetcher()
const departmentFetcher = new DepartmentFetcher()

const isLoaded = ref<boolean>(false)
const list = ref<DeserializedRoleListDocument>(pageProps.roles as DeserializedRoleListDocument)
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
		"label": data.fullName,
		"value": data.id
	}))
])

const slug = ref<string>("")
const existence = ref<"exists"|"archived"|"*">("exists")

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
		"sort": [ "name" ]
	}), {
		async postOperations(deserializedData) {
			const IDsToCount = deserializedData.data.map(data => data.id)
			// eslint-disable-next-line no-use-before-define
			return await countUsersPerRole(IDsToCount)
		}
	})
}

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
	await fetchRoleInfos()
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
