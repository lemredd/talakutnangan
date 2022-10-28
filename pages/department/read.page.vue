<template>
	<ReceivedErrors v-if="receivedErrors.length" :received-errors="receivedErrors"/>

	<form @submit.prevent="openConfirmation">
		<label class="block">
			Full name:
			<input
				v-model="department.data.fullName"
				class="full-name border-solid"
				type="text"/>
		</label>
		<label class="block">
			Acronym:
			<input
				v-model="department.data.acronym"
				class="acronym border-solid"
				type="text"/>
		</label>
		<label class="block">
			May admit students:
			<input
				v-model="department.data.mayAdmit"
				class="may-admit"
				type="checkbox"/>
		</label>
		<div class="controls">
			<input
				type="submit"
				value="Save changes"
				class="btn btn-primary"/>
			<button
				v-if="mayRestoreDepartment"
				type="button"
				class="btn btn-primary"
				@click="restoreDepartment">
				Restore
			</button>
			<button
				v-if="mayArchiveDepartment"
				type="button"
				class="btn btn-primary"
				@click="archiveDepartment">
				Archive
			</button>
		</div>

		<ConfirmationPassword
			v-model="password"
			:must-confirm="isBeingConfirmed"
			@cancel="closeConfirmation"
			@confirm="updateDepartment"/>
	</form>
</template>

<style scoped lang="scss">
@import "@styles/btn.scss";

	.controls{
		@apply flex justify-between;
	}
</style>

<script setup lang="ts">
import { ref, inject, computed } from "vue"

import type { UnitError } from "$/types/server"
import type { PageContext } from "$/types/renderer"
import type { DeserializedDepartmentDocument } from "$/types/documents/department"

import Fetcher from "$@/fetchers/department"
import makeSwitch from "$@/helpers/make_switch"

import {
	ARCHIVE_AND_RESTORE
} from "$/permissions/department_combinations"
import { department as permissionGroup } from "$/permissions/permission_list"
import RequestEnvironment from "$/singletons/request_environment"

import ReceivedErrors from "@/helpers/received_errors.vue"
import ConfirmationPassword from "@/authentication/confirmation_password.vue"
import assignPath from "$@/external/assign_path"

const pageContext = inject("pageContext") as PageContext<"deserialized", "department">
const { pageProps } = pageContext
const { userProfile } = pageProps

const department = ref<DeserializedDepartmentDocument<"read">>(
	pageProps.department as DeserializedDepartmentDocument<"read">
)
const isDeleted = computed<boolean>(() => Boolean(department.value.data.deletedAt))

const mayArchiveDepartment = computed<boolean>(() => {
	const roles = userProfile.data?.roles.data
	const isPermitted = permissionGroup.hasOneRoleAllowed(roles, [
		ARCHIVE_AND_RESTORE
	])

	return !isDeleted.value && isPermitted
})

const mayRestoreDepartment = computed<boolean>(() => {
	const roles = userProfile.data?.roles.data
	const isPermitted = permissionGroup.hasOneRoleAllowed(roles, [
		ARCHIVE_AND_RESTORE
	])

	return isDeleted.value && isPermitted
})

const password = ref<string>(
	RequestEnvironment.isNotOnProduction
		? "password"
		: ""
)

const receivedErrors = ref<string[]>([])

const fetcher = new Fetcher()

const {
	"state": isBeingConfirmed,
	"on": openConfirmation,
	"off": closeConfirmation
} = makeSwitch(false)

function updateDepartment() {
	fetcher.update(department.value.data.id, {
		"acronym": department.value.data.acronym,
		"fullName": department.value.data.fullName,
		"mayAdmit": department.value.data.mayAdmit
	}, {
		"extraUpdateDocumentProps": {
			"meta": {
				"password": password.value
			}
		}
	})
	.then(() => {
		closeConfirmation()
		password.value = ""
		assignPath(`/department/read/${department.value.data.id}`)
	})
	.catch(({ body }) => {
		if (body) {
			const errors = body.errors as UnitError[]
			receivedErrors.value = errors.map((error: UnitError) => {
				const readableDetail = error.detail

				return readableDetail
			})
		} else {
			receivedErrors.value = [ "an error occured" ]
		}
	})
}

async function archiveDepartment() {
	await fetcher.archive([ department.value.data.id ])
	.then(({ body, status }) => {
		console.log(body, status)
	})
}

async function restoreDepartment() {
	await fetcher.restore([ department.value.data.id ])
	.then(({ body, status }) => {
		console.log(body, status)
	})
}
</script>
