<template>
	<ReceivedErrors v-if="receivedErrors.length" :received-errors="receivedErrors"/>

	<form @submit.prevent="openConfirmation">
		<div class="role-name">
			<RoleNameField
				v-model="role.data.name"
				label="Role Name"
				type="text"
				:status="nameFieldStatus"
				@update:status="updateNameFieldStatus"/>
		</div>

		<FlagSelector
			v-for="flagSelector in flagSelectors"
			:key="flagSelector.permissionGroup.name"
			v-model="role.data[flagSelector.permissionGroup.name]"
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
				v-if="isDeleted"
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
@import "@styles/error.scss";
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

import { ARCHIVE_AND_RESTORE } from "$/permissions/role_combinations"
import { role as permissionGroup } from "$/permissions/permission_list"

import FlagSelector from "@/role/flag_selector.vue"
import ReceivedErrors from "@/helpers/received_errors.vue"
import RoleNameField from "@/fields/non-sensitive_text.vue"
import ConfirmationPassword from "@/authentication/confirmation_password.vue"

type RequiredExtraProps = "role"
const pageContext = inject("pageContext") as PageContext<"deserialized", RequiredExtraProps>
const { pageProps } = pageContext
const { userProfile } = pageProps

const role = ref<DeserializedRoleDocument<"read">>(
	pageProps.role as DeserializedRoleDocument<"read">
)
const receivedErrors = ref<string[]>([])

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

const mayArchiveRole = computed<boolean>(() => {
	const roles = userProfile.data.roles.data
	const isPermitted = permissionGroup.hasOneRoleAllowed(roles, [
		ARCHIVE_AND_RESTORE
	])

	return !isDeleted.value && isPermitted
})

const {
	"state": isBeingConfirmed,
	"on": openConfirmation,
	"off": closeConfirmation
} = makeSwitch(false)

const nameFieldStatus = ref<FieldStatus>("locked")

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
	.then(({ body, status }) => {
		closeConfirmation()
		password.value = ""
		nameFieldStatus.value = "locked"
		console.log(body, status)
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

async function archiveRole() {
	await fetcher.archive([ role.value.data.id ])
	.then(({ body, status }) => {
		console.log(body, status)
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
	.then(({ body, status }) => {
		console.log(body, status)
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

function updateNameFieldStatus(newStatus: FieldStatus) {
	switch (newStatus) {
		case "unlocked":
			nameFieldStatus.value = newStatus
			break
		case "locked":
			updateRole()
			break
		default: throw new Error("Developer error!")
	}
}
</script>
