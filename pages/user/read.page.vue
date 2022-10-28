<template>
	<form @submit.prevent="updateAndReload">
		<div class="user-name">
			<NonSensitiveTextField
				v-model="user.data.name"
				v-model:status="nameFieldStatus"
				label="User Name"
				type="text"/>
		</div>

		<div class="roles">
			<MultiSelectableOptionsField
				v-model="userRoleIDs"
				class="selectable-roles"
				label="Roles"
				:options="selectableRoles"/>
		</div>

		<div class="department">
			<SelectableOptionsField
				v-model="userDepartment"
				class="selectable-department"
				label="Department"
				:options="selectableDepartments"/>
		</div>

		<div class="controls flex justify-between">
			<button type="submit" class="btn btn-primary">
				Submit
			</button>
			<button
				v-if="isDeleted"
				type="button"
				class="btn btn-primary"
				@click="restoreUser">
				Restore
			</button>
			<button
				v-if="mayArchiveUser"
				type="button"
				class="btn btn-primary"
				@click="archiveUser">
				Archive
			</button>
		</div>
	</form>
</template>

<style scoped lang="scss">
@import "@styles/btn.scss";
</style>

<script setup lang="ts">
import {
	ref,
	inject,
	computed,
	onMounted
} from "vue"

import type { FieldStatus } from "@/fields/types"
import type { PageContext } from "$/types/renderer"
import type { OptionInfo } from "$@/types/component"
import type { ResourceCount } from "$/types/documents/base"
import type { DeserializedRoleResource } from "$/types/documents/role"
import type { DeserializedUserDocument } from "$/types/documents/user"
import type { DeserializedDepartmentResource } from "$/types/documents/department"

import Fetcher from "$@/fetchers/user"
import RoleFetcher from "$@/fetchers/role"
import assignPath from "$@/external/assign_path"
import DepartmentFetcher from "$@/fetchers/department"

import {
	ARCHIVE_AND_RESTORE_ANYONE_ON_ALL_DEPARTMENT,
	ARCHIVE_AND_RESTORE_ANYONE_ON_OWN_DEPARTMENT
} from "$/permissions/user_combinations"
import { user as permissionGroup } from "$/permissions/permission_list"
import NonSensitiveTextField from "@/fields/non-sensitive_text.vue"
import SelectableOptionsField from "@/fields/selectable_options.vue"
import MultiSelectableOptionsField from "@/fields/multi-selectable_options.vue"

type RequiredExtraProps = "user" | "roles" | "departments"
const pageContext = inject("pageContext") as PageContext<"deserialized", RequiredExtraProps>
const { pageProps } = pageContext

const user = ref<DeserializedUserDocument<"roles">>(
	pageProps.user as DeserializedUserDocument<"roles">
)

const roles = ref<DeserializedRoleResource[]>(
	pageProps.roles.data as DeserializedRoleResource[]
)
const userRoleIDs = ref(
	user.value.data.roles.data.map(role => role.id) as string[]
)
const selectableRoles = computed<OptionInfo[]>(() => roles.value.map(
	(role: DeserializedRoleResource) => ({
		"label": role.name,
		"value": role.id
	})
))
const isDeleted = computed<boolean>(() => Boolean(user.value.deletedAt))

const nameFieldStatus = ref<FieldStatus>("locked")

const departments = ref<DeserializedDepartmentResource[]>(
	pageProps.departments.data as DeserializedDepartmentResource[]
)
const userDepartment = ref(user.value.data.department?.data.id as string)
const selectableDepartments = computed(() => departments.value.map(
	department => ({
		"label": department.fullName,
		"value": department.id
	})
))

const { userProfile } = pageProps

const mayArchiveUser = computed<boolean>(() => {
	const users = userProfile.data.roles.data
	const isPermitted = permissionGroup.hasOneRoleAllowed(users, [
		ARCHIVE_AND_RESTORE_ANYONE_ON_ALL_DEPARTMENT,
		ARCHIVE_AND_RESTORE_ANYONE_ON_OWN_DEPARTMENT
	])

	return !isDeleted.value && isPermitted
})

const fetcher = new Fetcher()

async function updateUser() {
	await fetcher.update(user.value.data.id, {
		"email": user.value.data.email,
		"kind": user.value.data.kind,
		"name": user.value.data.name,
		"prefersDark": user.value.data.prefersDark ? user.value.data.prefersDark : false
	})
	await new Promise(resolve => {
		setTimeout(resolve, 1000)
	})
	await fetcher.updateAttachedRole(user.value.data.id, userRoleIDs.value)
	await new Promise(resolve => {
		setTimeout(resolve, 1000)
	})
	await fetcher.updateDepartment(user.value.data.id, userDepartment.value)
	await new Promise(resolve => {
		setTimeout(resolve, 1000)
	})
}

function updateAndReload() {
	updateUser()
	.then(() => assignPath(`/user/read/${user.value.data.id}`))
	.catch(error => console.log(error))
}


async function archiveUser() {
	await fetcher.archive([ user.value.data.id ])
	.then(({ body, status }) => {
		console.log(body, status)
	})
}

async function restoreUser() {
	await fetcher.restore([ user.value.data.id ])
	.then(({ body, status }) => {
		console.log(body, status)
	})
}

const roleFetcher = new RoleFetcher()
async function fetchRolesIncrementally(): Promise<void> {
	await roleFetcher.list({
		"filter": {
			"department": "*",
			"existence": "exists",
			"slug": ""
		},
		"page": {
			"limit": 10,
			"offset": roles.value.length
		},
		"sort": [ "name" ]
	}).then(({ body }) => {
		roles.value = [
			...roles.value,
			...body.data
		]

		const meta = body.meta as ResourceCount
		if (roles.value.length < meta.count) {
			return fetchRolesIncrementally()
		}

		return Promise.resolve()
	})
}

const departmentFetcher = new DepartmentFetcher()
async function fetchDepartmentsIncrementally(): Promise<void> {
	await departmentFetcher.list({
		"filter": {
			"existence": "exists",
			"slug": ""
		},
		"page": {
			"limit": 10,
			"offset": departments.value.length
		},
		"sort": [ "fullName" ]
	}).then(({ body }) => {
		departments.value = [
			...departments.value,
			...body.data
		]

		const meta = body.meta as ResourceCount
		if (departments.value.length < meta.count) {
			console.log("requests department\n\n\n")
			return fetchDepartmentsIncrementally()
		}

		return Promise.resolve()
	})
}

onMounted(async() => {
	await fetchDepartmentsIncrementally()
	await fetchRolesIncrementally()
})
</script>
