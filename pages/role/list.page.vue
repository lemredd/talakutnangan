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
			<ResourceList :filtered-list="list" :may-edit="mayEditRole"/>
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
import type { DeserializedRoleResource } from "$/types/documents/role"
import type { DeserializedDepartmentResource } from "$/types/documents/department"

import { role as permissionGroup } from "$/permissions/permission_list"
import { CREATE, UPDATE, ARCHIVE_AND_RESTORE } from "$/permissions/role_combinations"
import { DEBOUNCED_WAIT_DURATION } from "$@/constants/time"
import resourceTabInfos from "@/resource_management/resource_tab_infos"

import Fetcher from "$@/fetchers/role"
import debounce from "$@/helpers/debounce"
import DepartmentFetcher from "$@/fetchers/department"
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
const list = ref<DeserializedRoleResource[]>(pageProps.roles.data as DeserializedRoleResource[])
const departments = ref<DeserializedDepartmentResource[]>(
	pageProps.departments.data as DeserializedDepartmentResource[]
)
const chosenDepartment = ref<string>("*")
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

const slug = ref<string>("")
const existence = ref<"exists"|"archived"|"*">("exists")

async function fetchRoleInfos(): Promise<number|void> {
	await fetcher.list({
		"filter": {
			"department": chosenDepartment.value,
			"existence": existence.value,
			"slug": slug.value
		},
		"page": {
			"limit": 10,
			"offset": list.value.length
		},
		"sort": [ "name" ]
	}).then(response => {
		isLoaded.value = true
		const deserializedData = response.body.data as DeserializedRoleResource[]
		const IDsToCount = deserializedData.map(data => data.id)

		if (deserializedData.length === 0) return Promise.resolve()

		list.value = [ ...list.value, ...deserializedData ]

		// eslint-disable-next-line no-use-before-define
		return countUsersPerRole(IDsToCount)
	})
}

async function countUsersPerRole(IDsToCount: string[]) {
	await fetcher.countUsers(IDsToCount).then(response => {
		const deserializedData = response.body.data

		for (const identifierData of deserializedData) {
			const { id, meta } = identifierData

			const index = list.value.findIndex(data => data.id === id)

			if (index > -1) {
				list.value[index].meta = meta
			}
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
	list.value = []
	isLoaded.value = false
	await fetchRoleInfos()
}

watch([ chosenDepartment, slug, existence ], debounce(refetchRoles, DEBOUNCED_WAIT_DURATION))

onMounted(async() => {
	await countUsersPerRole(list.value.map(item => item.id))
	await loadRemainingDepartments(departments, departmentFetcher)
	isLoaded.value = true
})
</script>
