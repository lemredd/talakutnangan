<template>
	<ListRedirector resource-type="role"/>

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

		<Suspensible :is-loaded="hasSubmittedRole">
			<div class="controls">
				<button
					v-if="mayUpdateRole"
					type="submit"
					class="update-user-btn btn btn-primary">
					submit
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
		</Suspensible>
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

	.controls {
		@apply flex justify-between;
	}
</style>

<script setup lang="ts">
import { ref, inject, computed } from "vue"

import type { FieldStatus } from "@/fields/types"
import type { PageContext } from "$/types/renderer"
import type { RoleManagementInfo } from "$@/types/independent"
import type { DeserializedRoleDocument, RoleAttributes } from "$/types/documents/role"

import Fetcher from "$@/fetchers/role"
import makeSwitch from "$@/helpers/make_switch"
import makeManagementInfo from "@/role/make_management_info"
import fillSuccessMessages from "$@/helpers/fill_success_messages"
import makeFlagSelectorInfos from "@/role/make_flag_selector_infos"
import extractAllErrorDetails from "$@/helpers/extract_all_error_details"

import Suspensible from "@/helpers/suspensible.vue"
import FlagSelector from "@/role/flag_selector.vue"
import ListRedirector from "@/helpers/list_redirector.vue"
import RoleNameField from "@/fields/non-sensitive_text_capital.vue"
import ReceivedErrors from "@/helpers/message_handlers/received_errors.vue"
import ConfirmationPassword from "@/authentication/confirmation_password.vue"
import ReceivedSuccessMessages from "@/helpers/message_handlers/received_success_messages.vue"

type RequiredExtraProps = "role"
const pageContext = inject("pageContext") as PageContext<"deserialized", RequiredExtraProps>
const { pageProps } = pageContext
const { userProfile } = pageProps

const role = ref<DeserializedRoleDocument>(
	{
		...pageProps.role,
		"data": {
			...pageProps.role.data
		}
	} as DeserializedRoleDocument
)

const receivedErrors = ref<string[]>([])
const successMessages = ref<string[]>([])

const roleData = computed<RoleAttributes<"deserialized">>({
	get(): RoleAttributes<"deserialized"> {
		return role.value.data
	},
	set(newResource: RoleAttributes<"deserialized">): void {
		role.value = {
			...role.value,
			"data": {
				...role.value.data,
				...newResource
			}
		}
	}
})

const managementInfo = computed<RoleManagementInfo>(
	() => makeManagementInfo(userProfile, role.value.data)
)
const mayUpdateRole = computed<boolean>(() => managementInfo.value.mayUpdateRole)
const mayArchiveRole = computed<boolean>(() => managementInfo.value.mayArchiveRole)
const mayRestoreRole = computed<boolean>(() => managementInfo.value.mayRestoreRole)

const {
	"state": isBeingConfirmed,
	"on": openConfirmation,
	"off": closeConfirmation
} = makeSwitch(false)

const nameFieldStatus = ref<FieldStatus>(mayUpdateRole.value ? "enabled" : "disabled")
const flagSelectors = makeFlagSelectorInfos(roleData)
const areFlagSelectorsDisabled = computed<boolean>(() => !mayUpdateRole.value)

const hasSubmittedRole = ref<boolean>(true)

const fetcher: Fetcher = new Fetcher()
const password = ref<string>("")
async function updateRole() {
	hasSubmittedRole.value = false
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

		fillSuccessMessages(receivedErrors, successMessages)
	})
	.catch(responseWithErrors => extractAllErrorDetails(responseWithErrors, receivedErrors))
	hasSubmittedRole.value = true
}

async function archiveRole() {
	hasSubmittedRole.value = false

	await fetcher.archive([ role.value.data.id ])
	.then(() => {
		if (!role.value.data.deletedAt) role.value.data.deletedAt = new Date()

		fillSuccessMessages(receivedErrors, successMessages)
	})
	.catch(responseWithErrors => extractAllErrorDetails(responseWithErrors, receivedErrors))

	hasSubmittedRole.value = true
}

async function restoreRole() {
	hasSubmittedRole.value = false

	await fetcher.restore([ role.value.data.id ])
	.then(() => {
		if (role.value.data.deletedAt) role.value.data.deletedAt = null

		fillSuccessMessages(receivedErrors, successMessages)
	})
	.catch(responseWithErrors => extractAllErrorDetails(responseWithErrors, receivedErrors))

	hasSubmittedRole.value = true
}
</script>
