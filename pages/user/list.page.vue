<template>
	<ResourceManager
		v-model:chosen-role="chosenRole"
		v-model:chosen-department="chosenDepartment"
		v-model:slug="slug"
		:is-loaded="isLoaded"
		:department-names="departmentNames"
		:role-names="roleNames">
		<template #header>
			<TabbedPageHeader
				v-if="currentResourceManager.isAdmin()"
				:title="determineTitle"
				:tab-infos="resourceTabInfos"/>
			<h1 v-else class="resource-config-header">
				{{ determineTitle }}
			</h1>
		</template>

		<template #resources>
			<ResourceList :filtered-list="list"/>
		</template>
	</ResourceManager>
</template>

<style scoped lang="scss">
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

import { DEBOUNCED_WAIT_DURATION } from "$@/constants/time"
import resourceTabInfos from "@/resource_management/resource_tab_infos"

import Fetcher from "$@/fetchers/user"
import Manager from "$/helpers/manager"
import debounce from "$@/helpers/debounce"

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

const windowOffset = ref(0)

const slug = ref("")

function fetchUserInfo() {
	isLoaded.value = false
	new Fetcher().list({
		"filter": {
			"department": currentResourceManager.isAdmin()
				? chosenDepartment.value
				: currentUserDepartment.id,
			"existence": "exists",
			"kind": "*",
			"role": chosenRole.value,
			"slug": slug.value
		},
		"page": {
			"limit": 10,
			"offset": windowOffset.value
		},
		"sort": [ "name" ]
	}).then(({ "body": deserializedUserList }) => {
		isLoaded.value = true
		const deserializedData = deserializedUserList.data as DeserializedUserResource[]
		const offsetIncrement = 10

		if (!deserializedData.length) return Promise.resolve()

		list.value = deserializedData

		windowOffset.value += offsetIncrement

		return Promise.resolve()
	})
}

onMounted(() => {
	fetchUserInfo()
})

function resetUsersList() {
	windowOffset.value = 0
	list.value = []
}

const refetchUsers = debounce(fetchUserInfo, DEBOUNCED_WAIT_DURATION)
watch([ windowOffset, slug ], refetchUsers)
watch([ chosenRole, chosenDepartment ], debounce(() => {
	resetUsersList()
	refetchUsers()
}, DEBOUNCED_WAIT_DURATION))

</script>
