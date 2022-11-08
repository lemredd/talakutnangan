<template>
	<ReceivedErrors v-if="receivedErrors.length" :received-errors="receivedErrors"/>
	<ReceivedSuccessMessages
		v-if="successMessages.length"
		:received-success-messages="successMessages"/>
	<form
		class="user-data-form"
		@submit.prevent="updateUser">
		<h1 class="user-data-form-header">
			General User data
		</h1>
		<div class="user-name">
			<NonSensitiveTextField
				v-model="user.data.name"
				v-model:status="nameFieldStatus"
				label="User Name"
				type="text"/>
		</div>
		<button type="submit" class="update-user-btn btn btn-primary">
			update user
		</button>
	</form>

	<form
		class="user-data-form"
		@submit.prevent="updateRoles">
		<h1 class="user-data-form-header">
			Attached Roles
		</h1>
		<div class="roles">
			<MultiSelectableOptionsField
				v-model="userRoleIDs"
				class="selectable-roles"
				:disabled="mayNotSelect"
				label="Roles"
				:options="selectableRoles"/>
		</div>
		<button type="submit" class="update-roles-btn btn btn-primary">
			update roles
		</button>
	</form>

	<form
		class="user-data-form"
		@submit.prevent="updateDepartment">
		<h1 class="user-data-form-header">
			Department
		</h1>
		<div class="department">
			<SelectableOptionsField
				v-model="userDepartment"
				class="selectable-department"
				:disabled="mayNotSelect"
				label="Department"
				:options="selectableDepartments"/>
		</div>
		<button type="submit" class="update-department-btn btn btn-primary">
			update department
		</button>
	</form>

	<div class="controls flex justify-between mt-3">
		<button
			v-if="mayRestoreUser"
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
		<button
			v-if="mayReset"
			type="button"
			class="btn btn-primary"
			@click="resetUserPassword">
			Reset
		</button>
	</div>
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
import DepartmentFetcher from "$@/fetchers/department"

import { user as permissionGroup } from "$/permissions/permission_list"
import {
	RESET_PASSWORD,
	UPDATE_ANYONE_ON_OWN_DEPARTMENT,
	UPDATE_ANYONE_ON_ALL_DEPARTMENTS,
	ARCHIVE_AND_RESTORE_ANYONE_ON_ALL_DEPARTMENT,
	ARCHIVE_AND_RESTORE_ANYONE_ON_OWN_DEPARTMENT
} from "$/permissions/user_combinations"

import extractAllErrorDetails from "$@/helpers/extract_all_error_details"

import NonSensitiveTextField from "@/fields/non-sensitive_text.vue"
import SelectableOptionsField from "@/fields/selectable_options.vue"
import ReceivedErrors from "@/helpers/message_handlers/received_errors.vue"
import MultiSelectableOptionsField from "@/fields/multi-selectable_options.vue"
import ReceivedSuccessMessages from "@/helpers/message_handlers/received_success_messages.vue"

type RequiredExtraProps = "user" | "roles" | "departments"
const pageContext = inject("pageContext") as PageContext<"deserialized", RequiredExtraProps>
const { pageProps } = pageContext

const user = ref<DeserializedUserDocument<"roles"|"department">>(
	pageProps.user as DeserializedUserDocument<"roles"|"department">
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

const departments = ref<DeserializedDepartmentResource[]>(
	pageProps.departments.data as DeserializedDepartmentResource[]
)
const userDepartment = ref(user.value.data.department.data.id as string)
const selectableDepartments = computed(() => departments.value.map(
	department => ({
		"label": department.fullName,
		"value": department.id
	})
))

const { userProfile } = pageProps
const isOnSameDepartment = computed<boolean>(() => {
	const ownDepartment = userProfile.data.department.data.id
	return ownDepartment === user.value.data.department.data.id
})
const mayUpdateUser = computed<boolean>(() => {
	const users = userProfile.data.roles.data
	const isLimitedUpToDepartmentScope = permissionGroup.hasOneRoleAllowed(users, [
		UPDATE_ANYONE_ON_OWN_DEPARTMENT
	]) && isOnSameDepartment.value

	const isLimitedUpToGlobalScope = permissionGroup.hasOneRoleAllowed(userProfile.data.roles.data, [
		UPDATE_ANYONE_ON_ALL_DEPARTMENTS
	])

	return isLimitedUpToDepartmentScope || isLimitedUpToGlobalScope
})

const mayArchiveOrRestoreUser = computed<boolean>(() => {
	const users = userProfile.data.roles.data
	const isLimitedUpToDepartmentScope = permissionGroup.hasOneRoleAllowed(users, [
		ARCHIVE_AND_RESTORE_ANYONE_ON_OWN_DEPARTMENT
	]) && isOnSameDepartment.value

	const isLimitedUpToGlobalScope = permissionGroup.hasOneRoleAllowed(userProfile.data.roles.data, [
		ARCHIVE_AND_RESTORE_ANYONE_ON_ALL_DEPARTMENT
	])

	return isLimitedUpToDepartmentScope || isLimitedUpToGlobalScope
})
const mayArchiveUser = computed<boolean>(() => !isDeleted.value && mayArchiveOrRestoreUser.value)
const mayRestoreUser = computed<boolean>(() => isDeleted.value && mayArchiveOrRestoreUser.value)

const mayResetPassword = computed<boolean>(() => {
	const users = userProfile.data.roles.data
	const isLimitedUpToDepartmentScope = permissionGroup.hasOneRoleAllowed(users, [
		RESET_PASSWORD
	])

	return isLimitedUpToDepartmentScope
})
const mayReset = computed<boolean>(() => mayResetPassword.value)

const nameFieldStatus = ref<FieldStatus>(mayUpdateUser.value ? "locked" : "disabled")
const mayNotSelect = computed<boolean>(() => !mayUpdateUser.value)

const fetcher = new Fetcher()
const receivedErrors = ref<string[]>([])
const successMessages = ref<string[]>([])
async function updateUser() {
	await fetcher.update(user.value.data.id, {
		"email": user.value.data.email,
		"kind": user.value.data.kind,
		"name": user.value.data.name,
		"prefersDark": user.value.data.prefersDark ? user.value.data.prefersDark : false
	})
	.then()
	.catch(response => extractAllErrorDetails(response, receivedErrors, successMessages))
}
async function updateRoles() {
	await fetcher.updateAttachedRole(user.value.data.id, userRoleIDs.value)
	.then()
	.catch(response => extractAllErrorDetails(response, receivedErrors, successMessages))
}
async function updateDepartment() {
	await fetcher.updateDepartment(user.value.data.id, userDepartment.value).then(() => {
		user.value.data.department.data.id = userDepartment.value
	})
	.then()
	.catch(response => extractAllErrorDetails(response, receivedErrors, successMessages))
}

async function resetUserPassword() {
	await fetcher.resetPassword(user.value.data.id)
	.then(({ body, status }) => {
		console.log(body, status)
	})
	.catch(response => extractAllErrorDetails(response, receivedErrors, successMessages))
}

async function archiveUser() {
	await fetcher.archive([ user.value.data.id ])
	.then(({ body, status }) => {
		console.log(body, status)
	})
	.catch(response => extractAllErrorDetails(response, receivedErrors, successMessages))
}

async function restoreUser() {
	await fetcher.restore([ user.value.data.id ])
	.then(({ body, status }) => {
		console.log(body, status)
	})
	.catch(response => extractAllErrorDetails(response, receivedErrors, successMessages))
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
