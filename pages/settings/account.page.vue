<template>
	<SettingsHeader title="User Settings"/>
	<form class="text-dark-200 dark:text-light-100 flex flex-col" @submit.prevent>
		<NonSensitiveTextualField
			v-model="email"
			label="E-mail"
			type="email"
			:editable="true"/>
		<UpdatePasswordField/>

		<NonSensitiveTextualField
			v-if="isCurrentlyStudent"
			v-model="studentNumber"
			label="Student Number"
			type="text"
			:disabled="true"/>
		<NonSensitiveTextualField
			v-model="groupName"
			:label="groupKind"
			type="text"
			:disabled="true"/>
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
import { inject, provide, ref, computed, onBeforeMount, onMounted } from "vue"

import type { TabInfo } from "$@/types/component"
import type { PageContext } from "$/types/renderer"
import type { DeserializedUserProfile } from "$/types/documents/user"

import Fetcher from "$@/fetchers/user"

import SettingsHeader from "@/tabbed_page_header.vue"
import UpdatePasswordField from "@/settings/update_password_field.vue"
import NonSensitiveTextualField from "@/fields/non-sensitive_text.vue"

const pageContext = inject("pageContext") as PageContext<"deserialized">
const { pageProps } = pageContext
const { userProfile } = pageProps
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

onBeforeMount(() => {
	Fetcher.initialize("/api")
})

let rawFetcher: Fetcher|null = null

function fetcher(): Fetcher {
	if (rawFetcher) return rawFetcher

	throw new Error("Users cannot be processed to server yet")
}

const tabs: TabInfo[] = [
	{
		"label": "Account",
		"path": "/settings/account"
	},
	{
		"label": "Profile",
		"path": "/settings/profile"
	}
]

provide("tabs", tabs)

onMounted(() => {
	rawFetcher = new Fetcher()
})
</script>
