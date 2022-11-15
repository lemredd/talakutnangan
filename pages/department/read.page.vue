<template>
	<ReceivedErrors v-if="receivedErrors.length" :received-errors="receivedErrors"/>
	<ReceivedSuccessMessages
		v-if="successMessages.length"
		:received-success-messages="successMessages"/>
	<form @submit.prevent="openConfirmation">
		<NonSensitiveTextField
			v-model="department.data.fullName"
			v-model:status="fieldStatus"
			class="full-name border-solid"
			label="Full name"
			type="text"/>
		<NonSensitiveTextField
			v-model="capitalAcronym"
			v-model:status="fieldStatus"
			class="acronym border-solid"
			label="Acronym"
			type="text"/>
		<Checkbox
			v-model="mayAdmitRaw"
			:value="MAY_ADMIT"
			class="may-admit"
			label="May admit students"
			:disabled="mayNotChangeAdmission"/>
		<div class="controls">
			<Suspensible :is-loaded="hasSubmittedDepartment">
				<button type="submit" class="update-department-btn btn btn-primary">
					update department
				</button>
			</Suspensible>
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

import type { FieldStatus } from "@/fields/types"
import type { PageContext } from "$/types/renderer"
import type { DeserializedDepartmentDocument } from "$/types/documents/department"

import Fetcher from "$@/fetchers/department"
import makeSwitch from "$@/helpers/make_switch"
import fillSuccessMessages from "$@/helpers/fill_success_messages"
import extractAllErrorDetails from "$@/helpers/extract_all_error_details"

import RequestEnvironment from "$/singletons/request_environment"
import { department as permissionGroup } from "$/permissions/permission_list"
import { UPDATE, ARCHIVE_AND_RESTORE } from "$/permissions/department_combinations"

import Checkbox from "@/fields/checkbox.vue"
import NonSensitiveTextField from "@/fields/non-sensitive_text_capital.vue"
import ReceivedErrors from "@/helpers/message_handlers/received_errors.vue"
import ConfirmationPassword from "@/authentication/confirmation_password.vue"
import ReceivedSuccessMessages from "@/helpers/message_handlers/received_success_messages.vue"

const pageContext = inject("pageContext") as PageContext<"deserialized", "department">
const { pageProps } = pageContext
const { userProfile } = pageProps


const department = ref<DeserializedDepartmentDocument<"read">>(
	pageProps.department as DeserializedDepartmentDocument<"read">
)

const capitalAcronym = computed({
	"get": () => department.value.data.acronym,
	set(newValue: string): void {
		department.value.data.acronym = newValue.toUpperCase()
	}
})


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
const mayNotChangeAdmission = computed<boolean>(() => !mayUpdateDepartment.value)
const MAY_ADMIT = "1"
const mayAdmitRaw = computed<string[]>({
	get(): string[] { return department.value.data.mayAdmit ? [ MAY_ADMIT ] : [] },
	set(newValue: string[]) {
		department.value.data.mayAdmit = newValue.indexOf(MAY_ADMIT) > -1
	}
})
const password = ref<string>(
	RequestEnvironment.isNotOnProduction
		? "password"
		: ""
)

const fetcher = new Fetcher()

const {
	"state": isBeingConfirmed,
	"on": openConfirmation,
	"off": closeConfirmation
} = makeSwitch(false)

const hasSubmittedDepartment = ref<boolean>(true)

const receivedErrors = ref<string[]>([])
const successMessages = ref<string[]>([])
function updateDepartment() {
	hasSubmittedDepartment.value = false
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
	.catch(response => extractAllErrorDetails(response, receivedErrors, successMessages))
	hasSubmittedDepartment.value = true
}

async function archiveDepartment() {
	await fetcher.archive([ department.value.data.id ])
	.then(() => fillSuccessMessages(receivedErrors, successMessages))
	.catch(responseWithErrors => extractAllErrorDetails(responseWithErrors, receivedErrors))
}

async function restoreDepartment() {
	await fetcher.restore([ department.value.data.id ])
	.then(() => fillSuccessMessages(receivedErrors, successMessages))
	.catch(responseWithErrors => extractAllErrorDetails(responseWithErrors, receivedErrors))
}
</script>
