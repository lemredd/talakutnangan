<template>
	<SettingsHeader title="User Settings" :tab-infos="settingsTabInfos"/>
	<form class="text-dark-200 dark:text-light-100 flex flex-col" @submit.prevent>
		<NonSensitiveTextualField
			v-model="email"
			v-model:status="emailFieldStatus"
			label="E-mail"
			type="email"
			@save="updateEmail"/>
		<UpdatePasswordField/>

		<NonSensitiveTextualField
			v-if="isCurrentlyStudent"
			v-model="studentNumber"
			label="Student Number"
			type="text"
			status="disabled"/>
		<NonSensitiveTextualField
			v-model="groupName"
			:label="groupKind"
			type="text"
			status="disabled"/>
		<div>
			<h3 class="input-header">
				Roles
			</h3>
			<span class="role bg-white text-black">{{ roles }}</span>
		</div>
	</form>
</template>

<style lang="scss">
	@import "@styles/variables.scss";

	form {
		max-width: $mobileViewportMaximum;

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
const groupKind = computed<string>(() => {
	if (isCurrentlyUnreachableEmployee.value) return "Department"
	return "Institute"
})
const groupName = computed<string>(() => userProfile.data.department.data.acronym)

const roles = computed<string>(() => userProfile.data.roles.data.map(role => role.name).join(", "))

function updateEmail(): void {
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
