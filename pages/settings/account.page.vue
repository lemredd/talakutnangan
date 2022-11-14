<template>
	<SettingsHeader title="User Settings" :tab-infos="settingsTabInfos"/>
	<ReceivedErrors v-if="receivedErrors.length" :received-errors="receivedErrors"/>
	<ReceivedSuccessMessages
		v-if="successMessages.length"
		:received-success-messages="successMessages"/>
	<form class="account-settings" @submit.prevent>
		<NonSensitiveTextualField
			v-model="email"
			:status="emailFieldStatus"
			class="submittable-field email-field"
			:label="emailVerified"
			type="email"/>

		<NonSensitiveTextualField
			v-if="isCurrentlyStudent"
			v-model="studentNumber"
			label="Student Number"
			type="text"
			status="disabled"
			class="submittable-field student-number-field"/>
		<NonSensitiveTextualField
			v-model="department"
			:label="departmentLabelKind"
			type="text"
			status="disabled"
			class="submittable-field department-field"/>
		<div>
			<h3 class="input-header">
				Roles
			</h3>
			<span class="role bg-white text-black">{{ roles }}</span>
		</div>

		<div class="controls mt-8 flex justify-between">
			<button
				type="submit"
				class="submit-btn btn btn-primary"
				@click="updateUser">
				Save Changes
			</button>
			<button
				type="reset"
				class="reset-btn btn btn-secondary"
				@click.prevent="revertToOldData">
				cancel
			</button>
		</div>
	</form>

	<UpdatePasswordField class="update-password-field"/>
</template>

<style lang="scss">
	@import "@styles/variables.scss";
	@import "@styles/btn.scss";

	.wrapper {
		margin-bottom: 50vh !important;
	}

	form, .update-password-field {
		@apply mt-8;


		max-width: $mobileViewportMaximum;
	}


	form {
		.input-header {
			font-size: 1.25em;
		}
		.role {
			border-radius: 2em;
			padding: .5em 1em;
			width: max-content;
		}
	}
</style>

<style scoped lang="scss">
	.account-settings {
		> *:not(:first-of-type) {
			@apply my-12;
		}
	}
</style>

<script setup lang="ts">
import { inject, ref, computed } from "vue"

import type { FieldStatus } from "@/fields/types"
import type { PageContext } from "$/types/renderer"
import type { DeserializedUserProfile } from "$/types/documents/user"

import Fetcher from "$@/fetchers/user"
import settingsTabInfos from "@/settings/settings_tab_infos"
import { user as permissionGroup } from "$/permissions/permission_list"
import {
	UPDATE_OWN_DATA,
	UPDATE_ANYONE_ON_OWN_DEPARTMENT,
	UPDATE_ANYONE_ON_ALL_DEPARTMENTS
} from "$/permissions/user_combinations"

import SettingsHeader from "@/helpers/tabbed_page_header.vue"
import UpdatePasswordField from "@/settings/update_password_field.vue"
import NonSensitiveTextualField from "@/fields/non-sensitive_text.vue"
import extractAllErrorDetails from "$@/helpers/extract_all_error_details"
import ReceivedErrors from "@/helpers/message_handlers/received_errors.vue"
import ReceivedSuccessMessages from "@/helpers/message_handlers/received_success_messages.vue"

const fetcher = new Fetcher()

const pageContext = inject("pageContext") as PageContext<"deserialized">
const { pageProps } = pageContext
const { userProfile } = pageProps

const receivedErrors = ref<string[]>([])
const successMessages = ref<string[]>([])

const oldEmail = userProfile.data.email
const email = ref<string>(userProfile.data.email)

const mayEditEmail = computed<boolean>(() => {
	const isPermitted = permissionGroup.hasOneRoleAllowed(userProfile.data.roles.data, [
		UPDATE_OWN_DATA,
		UPDATE_ANYONE_ON_OWN_DEPARTMENT,
		UPDATE_ANYONE_ON_ALL_DEPARTMENTS
	])

	return isPermitted
})
const emailFieldStatus = ref<FieldStatus>(mayEditEmail.value ? "enabled" : "disabled")

const emailVerified = computed<string>(() => {
	let verifyEmail = ""
	const verification = userProfile.data.emailVerifiedAt !== null
	if (verification) {
		verifyEmail = "E-mail: Verified ✓"
	} else {
		verifyEmail = "E-mail: Unverified ✘"
	}

	return String(verifyEmail)
})

const isCurrentlyStudent = computed<boolean>(() => userProfile.data.kind === "student")
const studentNumber = computed<string>(() => {
	if (isCurrentlyStudent.value) {
		const castUserProfile = userProfile as DeserializedUserProfile<
			"department"|"roles"|"studentDetail"
		>

		return castUserProfile.data.studentDetail.data.studentNumber
	}

	return ""
})
const isCurrentlyUnreachableEmployee = computed<boolean>(
	() => userProfile.data.kind === "unreachable_employee"
)
const departmentLabelKind = computed<string>(() => {
	if (isCurrentlyUnreachableEmployee.value) return "Department"
	return "Institute"
})
const departmentFullName = userProfile.data.department.data.fullName
const departmentAcronym = userProfile.data.department.data.acronym
const department = ref(`${departmentFullName} (${departmentAcronym})`)

const roles = computed<string>(() => userProfile.data.roles.data.map(role => role.name).join(", "))

function revertToOldData() {
	email.value = oldEmail
}

function updateUser(): void {
	fetcher.update(userProfile.data.id, {
		"email": email.value,
		"emailVerifiedAt": userProfile.data.emailVerifiedAt?.toJSON() ?? null,
		"kind": userProfile.data.kind,
		"name": userProfile.data.name,
		"prefersDark": userProfile.data.prefersDark
	})
	.then(() => {
		if (receivedErrors.value.length) receivedErrors.value = []
		successMessages.value.push("Email updated successfully.")
	})
	.catch(response => extractAllErrorDetails(response, receivedErrors, successMessages))
}
</script>
