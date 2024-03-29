<template>
	<ListRedirector resource-type="role"/>
	<ReceivedErrors v-if="receivedErrors.length" :received-errors="receivedErrors"/>
	<ReceivedSuccessMessages
		v-if="successMessages.length"
		:received-success-messages="successMessages"/>

	<form @submit.prevent="createRole">
		<TextualField
			v-model="role.name"
			label="Role Name"
			type="text"/>

		<FlagSelector
			v-for="flagSelector in flagSelectors"
			:key="flagSelector.permissionGroup.name"
			v-model="role[flagSelector.permissionGroup.name]"
			:header="flagSelector.header"
			:base-permission-group="flagSelector.permissionGroup"
			:dependent-permission-groups="flagSelector.dependentGroups"
			@check-external-dependency-flags="flagSelector.checkExternal"
			@uncheck-externally-dependent-flags="flagSelector.uncheckExternal"/>

		<input
			class="btn btn-primary"
			type="submit"
			value="Create Role"/>
	</form>
</template>

<style scoped lang="scss">
	@import "@styles/btn.scss";
	.attrib-label {
		@apply block;
	}

	.flag-attrib{
		@apply border-solid;
	}
</style>

<script setup lang="ts">
import { ref } from "vue"

import type { RoleAttributes } from "$/types/documents/role"

import Fetcher from "$@/fetchers/role"

import FlagSelector from "@/role/flag_selector.vue"
import ListRedirector from "@/helpers/list_redirector.vue"
import TextualField from "@/fields/non-sensitive_text_capital.vue"
import fillSuccessMessages from "$@/helpers/fill_success_messages"
import makeFlagSelectorInfos from "@/role/make_flag_selector_infos"
import extractAllErrorDetails from "$@/helpers/extract_all_error_details"
import ReceivedErrors from "@/helpers/message_handlers/received_errors.vue"
import ReceivedSuccessMessages from "@/helpers/message_handlers/received_success_messages.vue"

const INITIAL_VALUE: RoleAttributes<"deserialized"> = {
	"auditTrailFlags": 0,
	"commentFlags": 0,
	"deletedAt": null,
	"departmentFlags": 1,
	"name": "",
	"postFlags": 0,
	"profanityFlags": 0,
	"roleFlags": 1,
	"semesterFlags": 0,
	"tagFlags": 0,
	"userFlags": 0
}
const role = ref<RoleAttributes<"deserialized">>({ ...INITIAL_VALUE })

const flagSelectors = makeFlagSelectorInfos(role)
const roleFetcher = new Fetcher()

const receivedErrors = ref<string[]>([])
const successMessages = ref<string[]>([])
function createRole() {
	roleFetcher.create({
		...role.value,
		"deletedAt": null
	}).then(() => {
		role.value = { ...INITIAL_VALUE }
		fillSuccessMessages(receivedErrors, successMessages)
	})
	.catch(responseWithErrors => extractAllErrorDetails(responseWithErrors, receivedErrors))
}
</script>
