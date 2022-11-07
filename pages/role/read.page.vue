<template>
	<ReceivedErrors v-if="receivedErrors.length" :received-errors="receivedErrors"/>
	<ReceivedSuccessMessages
		v-if="successMessages.length"
		:received-success-messages="successMessages"/>

	<form @submit.prevent="openConfirmation">
		<div class="role-name">
			<RoleNameField
				v-model="role.data.name"
				v-model:status="nameFieldStatus"
				label="Role Name"
				type="text"/>
		</div>

		<FlagSelector
			v-for="flagSelector in flagSelectors"
			:key="flagSelector.permissionGroup.name"
			v-model="role.data[flagSelector.permissionGroup.name]"
			:disabled="areFlagSelectorsDisabled"
			:header="flagSelector.header"
			:base-permission-group="flagSelector.permissionGroup"
			:dependent-permission-groups="flagSelector.dependentGroups"
			@check-external-dependency-flags="flagSelector.checkExternal"
			@uncheck-externally-dependent-flags="flagSelector.uncheckExternal"/>

		<div class="controls flex justify-between">
			<button type="submit" class="btn btn-primary">
				Submit
			</button>
			<button
				v-if="mayRestoreRole"
				type="button"
				class="restore-btn btn btn-primary"
				@click="restoreRole">
				Restore
			</button>
			<button
				v-if="mayArchiveRole"
				type="button"
				class="archive-btn btn btn-primary"
				@click="archiveRole">
				Archive
			</button>
		</div>
		<ConfirmationPassword
			v-model="password"
			:must-confirm="isBeingConfirmed"
			@cancel="closeConfirmation"
			@confirm="updateRole"/>
	</form>
</template>

<style scoped lang="scss">
@import "@styles/btn.scss";
@import "@styles/status_messages.scss";
</style>

<script setup lang="ts">
import { ref, inject, computed } from "vue"

import type { UnitError } from "$/types/server"
import type { FieldStatus } from "@/fields/types"
import type { PageContext } from "$/types/renderer"
import type { DeserializedRoleDocument, RoleAttributes } from "$/types/documents/role"

import Fetcher from "$@/fetchers/role"
import makeSwitch from "$@/helpers/make_switch"
import makeFlagSelectorInfos from "@/role/make_flag_selector_infos"

import { UPDATE, ARCHIVE_AND_RESTORE } from "$/permissions/role_combinations"
import { role as permissionGroup } from "$/permissions/permission_list"

import FlagSelector from "@/role/flag_selector.vue"
import ReceivedErrors from "@/helpers/message_handlers/received_errors.vue"
import RoleNameField from "@/fields/non-sensitive_text_capital.vue"
import ConfirmationPassword from "@/authentication/confirmation_password.vue"
import ReceivedSuccessMessages from "@/helpers/message_handlers/received_success_messages.vue"

type RequiredExtraProps = "role"
const pageContext = inject("pageContext") as PageContext<"deserialized", RequiredExtraProps>
const { pageProps } = pageContext
const { userProfile } = pageProps

const role = ref<DeserializedRoleDocument<"read">>(
	pageProps.role as DeserializedRoleDocument<"read">
)
const receivedErrors = ref<string[]>([])
const successMessages = ref<string[]>([])

const roleData = computed<RoleAttributes<"deserialized">>({
	get(): RoleAttributes<"deserialized"> { return role.value.data },
	set(newResource: RoleAttributes<"deserialized">): void {
		role.value.data = {
			...role.value.data,
			...newResource
		}
	}
})
const isDeleted = computed<boolean>(() => Boolean(role.value.data.deletedAt))
const password = ref<string>("")
const flagSelectors = makeFlagSelectorInfos(roleData)

const mayUpdateRole = computed<boolean>(() => {
	const roles = userProfile.data.roles.data
	const isPermitted = permissionGroup.hasOneRoleAllowed(roles, [ UPDATE ])

	return isPermitted
})
const mayArchiveOrRestoreRole = computed<boolean>(() => {
	const roles = userProfile.data.roles.data
	const isPermitted = permissionGroup.hasOneRoleAllowed(roles, [
		ARCHIVE_AND_RESTORE
	])

	return isPermitted
})

const mayArchiveRole = computed<boolean>(() => !isDeleted.value && mayArchiveOrRestoreRole.value)
const mayRestoreRole = computed<boolean>(() => isDeleted.value && mayArchiveOrRestoreRole.value)

const {
	"state": isBeingConfirmed,
	"on": openConfirmation,
	"off": closeConfirmation
} = makeSwitch(false)

const nameFieldStatus = ref<FieldStatus>(mayUpdateRole.value ? "enabled" : "disabled")
const areFlagSelectorsDisabled = computed<boolean>(() => !mayUpdateRole.value)

const fetcher: Fetcher = new Fetcher()
async function updateRole() {
	await fetcher.update(role.value.data.id, {
		"auditTrailFlags": role.value.data.auditTrailFlags,
		"commentFlags": role.value.data.commentFlags,
		"deletedAt": role.value.data.deletedAt?.toJSON() || null,
		"departmentFlags": role.value.data.departmentFlags,
		"name": role.value.data.name,
		"postFlags": role.value.data.postFlags,
		"profanityFlags": role.value.data.profanityFlags,
		"roleFlags": role.value.data.roleFlags,
		"semesterFlags": role.value.data.semesterFlags,
		"tagFlags": role.value.data.tagFlags,
		"userFlags": role.value.data.userFlags
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
		nameFieldStatus.value = "locked"

		if (receivedErrors.value.length) receivedErrors.value = []
		successMessages.value.push("Role has been successfully!")
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

async function archiveRole() {
	await fetcher.archive([ role.value.data.id ])
	.then(() => {
		successMessages.value.push("This role has been archived successfully")
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

async function restoreRole() {
	await fetcher.restore([ role.value.data.id ])
	.then(() => {
		successMessages.value.push("This role has been restored successfully")
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
</script>
