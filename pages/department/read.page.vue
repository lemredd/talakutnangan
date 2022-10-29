<template>
	<ReceivedErrors v-if="receivedErrors.length" :received-errors="receivedErrors"/>
	<ReceivedSuccessMessages
		v-if="successMessages.length"
		:received-success-messages="successMessages"/>
	<form @submit.prevent="openConfirmation">
		<label class="block">
			<NonSensitiveTextField
				v-model="department.data.fullName"
				v-model:status="fieldStatus"
				class="full-name border-solid"
				label="Full name"
				type="text"/>
		</label>
		<label class="block">
			<NonSensitiveTextField
				v-model="department.data.acronym"
				v-model:status="fieldStatus"
				class="acronym border-solid"
				label="Acronym"
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
import type { FieldStatus } from "@/fields/types"
import type { PageContext } from "$/types/renderer"
import type { DeserializedDepartmentDocument } from "$/types/documents/department"

import Fetcher from "$@/fetchers/department"
import makeSwitch from "$@/helpers/make_switch"

import RequestEnvironment from "$/singletons/request_environment"
import { department as permissionGroup } from "$/permissions/permission_list"
import { UPDATE, ARCHIVE_AND_RESTORE } from "$/permissions/department_combinations"

import NonSensitiveTextField from "@/fields/non-sensitive_text.vue"
import ReceivedErrors from "@/helpers/message_handlers/received_errors.vue"
import ConfirmationPassword from "@/authentication/confirmation_password.vue"
import ReceivedSuccessMessages from "@/helpers/message_handlers/received_success_messages.vue"

const pageContext = inject("pageContext") as PageContext<"deserialized", "department">
const { pageProps } = pageContext
const { userProfile } = pageProps

const department = ref<DeserializedDepartmentDocument<"read">>(
	pageProps.department as DeserializedDepartmentDocument<"read">
)
const isDeleted = computed<boolean>(() => Boolean(department.value.data.deletedAt))

const mayUpdateDepartment = computed<boolean>(() => {
	const roles = userProfile.data.roles.data
	const isPermitted = permissionGroup.hasOneRoleAllowed(roles, [ UPDATE ])

	return isPermitted
})
const mayArchiveOrRestoreDepartment = computed<boolean>(() => {
	const roles = userProfile.data.roles.data
	const isPermitted = permissionGroup.hasOneRoleAllowed(roles, [
		ARCHIVE_AND_RESTORE
	])

	return isPermitted
})

const mayArchiveDepartment = computed<boolean>(
	() => !isDeleted.value && mayArchiveOrRestoreDepartment.value
)
const mayRestoreDepartment = computed<boolean>(
	() => isDeleted.value && mayArchiveOrRestoreDepartment.value
)

const fieldStatus = ref<FieldStatus>(mayUpdateDepartment.value ? "enabled" : "disabled")
const password = ref<string>(
	RequestEnvironment.isNotOnProduction
		? "password"
		: ""
)

const receivedErrors = ref<string[]>([])
const successMessages = ref<string[]>([])

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
		if (receivedErrors.value.length) receivedErrors.value = []
		successMessages.value.push("Department has been read successfully!")
	})
	.catch(({ body }) => {
		if (successMessages.value.length) successMessages.value = []
		if (body) {
			const { errors } = body
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
