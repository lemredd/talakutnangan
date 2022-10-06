<template>
	<form @submit.prevent="createRole">
		<!-- TODO: capitalize each word in input automatically  -->
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
import makeFlagSelectorInfos from "@/role/make_flag_selector_infos"

import TextualField from "@/fields/non-sensitive_text.vue"
import FlagSelector from "@/role/flag_selector.vue"

const role = ref<RoleAttributes<"deserialized">>({
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
})

const flagSelectors = makeFlagSelectorInfos(role)
const roleFetcher = new Fetcher()

function createRole() {
	roleFetcher.create({
		...role.value,
		"deletedAt": null
	}).then(({ unusedBody, unusedStatus }) => {
		// Success
	}).catch(({ unusedBody, unusedStatus }) => {
		// Fail
	})
}
</script>
