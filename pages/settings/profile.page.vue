<template>
	<SettingsHeader title="User Settings"/>
	<div class="flex flex-col">
		<div>
			<TextualField
				v-model="userProfileData.name"
				label="Display Name"
				type="text"
				:editable="true"
				@save="updateUser"/>
		</div>

		<!-- TODO: Refactor all WindiCSS inline classes using `@apply` directive -->
		<!-- TODO: Refactor HTML to Vue Components if applicable -->
		<div class="pictures">
			<PicturePicker
				title="Profile Picture"
				:picture="userProfileData.profilePicture"
				@submit-file="submitProfilePicture"/>
			<PicturePicker
				title="Signature"
				:picture="userProfileData.signature"
				@submit-file="submitSignature"/>
		</div>

		<div class="dark-mode-toggle">
			<h3 class="display-name text-lg col-span-full">
				Dark Mode
			</h3>
			<p class="name">
				Click to toggle dark mode
			</p>
			<label for="dark-mode-toggle">
				<span class="material-icons-outlined">
					{{ `toggle_${prefersDark ? "on" : "off"}` }}
				</span>
				<input
					id="dark-mode-toggle"
					v-model="prefersDark"
					type="checkbox"
					name=""
					@click="toggleDarkMode"/>
			</label>
		</div>
		<div v-if="isReachableEmployee" class="consultation-schedules p-5">
			<h3 class="display-name text-lg col-span-full">
				Consultation Schedules
			</h3>
			<SchedulePicker
				v-for="schedule in schedules"
				:key="schedules.indexOf(schedule)"
				:day="schedule.day"
				:start-time="schedule.startTime"
				:end-time="schedule.endTime"/>
		</div>
	</div>
</template>

<style scoped lang="scss">
	form {
		max-width: 640px;

		.input-pic {
			display: none;
		}
	}

	.dark-mode-toggle {
		@apply p-5 grid;
		grid-template:
			"formHeader formHeader"
			"subtitle toggle";

		h3 {
			grid-area: formHeader;
		}

		h5 {
			grid-area: subtitle;
		}

		label {
			@apply flex flex-row-reverse;
			cursor: pointer;

			input {
				appearance: none;
			}
		}
	}
</style>

<script setup lang="ts">
import {
	ref,
	Ref,
	inject,
	provide,
	computed
} from "vue"

import type { TabInfo } from "$@/types/component"
import type { PageContext } from "$/types/renderer"
import type { DeserializedUserDocument } from "$/types/documents/user"

import TextualField from "@/fields/non-sensitive_text.vue"
import SettingsHeader from "@/tabbed_page_header.vue"
import PicturePicker from "@/settings/picture_picker.vue"
import SchedulePicker from "@/settings/schedule_picker.vue"

import UserFetcher from "$@/fetchers/user"
import assignPath from "$@/external/assign_path"
import SignatureFetcher from "$@/fetchers/signature"
import ProfilePictureFetcher from "$@/fetchers/profile_picture"
import RequestEnvironment from "$/singletons/request_environment"

const bodyClasses = inject("bodyClasses") as Ref<string[]>
const pageContext = inject("pageContext") as PageContext<"deserialized">

const userProfile = pageContext.pageProps.userProfile as DeserializedUserDocument
const userProfileData = ref(userProfile.data)

const { kind } = userProfile
const isReachableEmployee = computed(() => kind === "reachable_employee")


UserFetcher.initialize("/api")
SignatureFetcher.initialize("/api")
ProfilePictureFetcher.initialize("/api")

function submitProfilePicture(formData: FormData) {
	const profilePictureFetcher = new ProfilePictureFetcher()

	if (userProfileData.value.profilePicture) {
		profilePictureFetcher.updateFile(
			userProfileData.value.profilePicture.data.id,
			formData
		).then(() => assignPath("/settings/profile"))
	} else {
		profilePictureFetcher.createFile(
			userProfileData.value.id,
			formData
		).then(() => assignPath("/settings/profile"))
	}
}
function submitSignature(formData: FormData) {
	const signatureFetcher = new SignatureFetcher()

	if (userProfileData.value.profilePicture) {
		signatureFetcher.renew(
			userProfileData.value.id,
			formData
		).then(() => assignPath("/settings/profile"))
	} else {
		signatureFetcher.renew(
			userProfileData.value.id,
			formData
		).then(() => assignPath("/settings/profile"))
	}
}
function updateUser() {
	new UserFetcher().update(userProfileData.value.id, {
		...userProfileData.value
	})
}

const emit = defineEmits([ "toggleDarkMode" ])

const prefersDark = ref(userProfileData.value.prefersDark)
function toggleDarkMode() {
	if (RequestEnvironment.isOnTest) {
		emit("toggleDarkMode")
	}

	const mutatedBodyClasses = new Set([ ...bodyClasses.value ])
	if (mutatedBodyClasses.has("dark")) {
		mutatedBodyClasses.delete("dark")
	} else {
		mutatedBodyClasses.add("dark")
	}

	bodyClasses.value = [ ...mutatedBodyClasses ]
	userProfileData.value.prefersDark = !userProfileData.value.prefersDark
	updateUser()
}

const schedules = [
	{
		"day": "monday",
		"endTime": "17:00",
		"startTime": "08:00"
	},
	{
		"day": "tuesday",
		"endTime": "17:00",
		"startTime": "08:00"
	},
	{
		"day": "wednesday",
		"endTime": "17:00",
		"startTime": "08:00"
	}
]

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
</script>
