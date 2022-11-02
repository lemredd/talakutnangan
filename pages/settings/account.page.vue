<template>
	<SettingsHeader
		title="User Settings"
		:tab-infos="settingsTabInfos"
		class="border-b"/>
	<form class="text-dark-200 dark:text-light-100 flex flex-col" @submit.prevent>
		<NonSensitiveTextualField
			class="submittable-field email-field"
			v-model="email"
			v-model:status="emailFieldStatus"
			label="E-mail"
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
				submit
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

<script setup lang="ts">
import { inject, ref, computed } from "vue"

import type { FieldStatus } from "@/fields/types"
import type { PageContext } from "$/types/renderer"
import type { DeserializedUserProfile } from "$/types/documents/user"

import Fetcher from "$@/fetchers/user"
import settingsTabInfos from "@/settings/settings_tab_infos"

import SettingsHeader from "@/helpers/tabbed_page_header.vue"
import UpdatePasswordField from "@/settings/update_password_field.vue"
import NonSensitiveTextualField from "@/fields/non-sensitive_text.vue"

const fetcher = new Fetcher()

const pageContext = inject("pageContext") as PageContext<"deserialized">
const { pageProps } = pageContext
const { userProfile } = pageProps


const emailFieldStatus = ref<FieldStatus>("locked")
const oldEmail = userProfile.data.email
const email = ref<string>(userProfile.data.email)
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
		"kind": userProfile.data.kind,
		"name": userProfile.data.name,
		"prefersDark": userProfile.data.prefersDark
	})
	.then(() => {
		//
	})
	.catch(() => {
		//
	})
}
</script>
