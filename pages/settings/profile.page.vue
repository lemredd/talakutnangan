<template>
	<SettingsHeader title="User Settings"/>
	<div class="profile-account">
		<div>
			<TextualField
				v-model="userProfileData.name"
				label="Display Name"
				type="text"
				:editable="true"
				@save="updateUser"/>
		</div>

		<!-- TODO: Refactor all WindiCSS inline classes using `@apply` directive -->
		<div class="pictures">
			<PicturePicker
				resource-type="profile_picture"
				@submit-file="submitProfilePicture">
				<div class="content">
					<div class="picture-picker-header">
						<h3 class="profile">
							Profile Picture
						</h3>
					</div>

					<label
						for="input-profile-picture"
						class="cursor-pointer">
						<span class="material-icons">add_circle</span>
						<small class="text-center ml-1">
							upload or replace image
						</small>
					</label>
				</div>

				<ProfilePicture class="profile-picker-sm"/>
			</PicturePicker>

			<PicturePicker
				v-if="!isUnReachableEmployee"
				resource-type="signature"
				@submit-file="submitSignature">
				<div class="content">
					<div class="picture-picker-header">
						<h3 class="signature">
							Signature
						</h3>
					</div>

					<label
						for="input-signature"
						class="cursor-pointer">
						<span class="material-icons">add_circle</span>
						<small class="text-center ml-1 underline">
							upload or replace image
						</small>
					</label>
				</div>

				<Signature class="schedule-picker-sm"/>
			</PicturePicker>
		</div>

		<div class="dark-mode-toggle">
			<h3 class="display-name">
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
		<div v-if="isReachableEmployee" class="consultation-schedules">
			<h3 class="display-name">
				Consultation Schedules
			</h3>
			<SchedulePickerGroup
				v-for="day in DayValues"
				:key="day"
				:day-name="day"
				:schedules="schedules"/>
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

	.profile-account{
		@apply flex flex-col;
	}

	.content{
		@apply flex flex-col sm:flex-row sm:justify-between my-7;
	}

	.cursor-pointer{
		@apply flex flex items-center;
	}

	.profile, .signature{
		font-size: 1.5em;
	}

	.profile-picker-sm, .schedule-picker-sm{
		@apply flex flex-row sm:flex-row max-w-30;
	}

	.dark-mode-toggle {
		@apply py-5 grid;
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

	.display-name{
		@apply flex flex-col;
		font-size: large;
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

import ProfilePicture from "@/helpers/profile_picture.vue"
import Signature from "@/helpers/signature.vue"
import SettingsHeader from "@/tabbed_page_header.vue"
import PicturePicker from "@/fields/picture_picker.vue"
import TextualField from "@/fields/non-sensitive_text.vue"
import SchedulePickerGroup from "@/settings/schedule_picker_group.vue"

import UserFetcher from "$@/fetchers/user"
import assignPath from "$@/external/assign_path"
import SignatureFetcher from "$@/fetchers/signature"
import ProfilePictureFetcher from "$@/fetchers/profile_picture"
import RequestEnvironment from "$/singletons/request_environment"
import EmployeeScheduleFetcher from "$@/fetchers/employee_schedule"
import { DeserializedEmployeeScheduleResource } from "$/types/documents/employee_schedule"

import { DayValues } from "$/types/database"

const bodyClasses = inject("bodyClasses") as Ref<string[]>
const pageContext = inject("pageContext") as PageContext<"deserialized">

const userProfile = pageContext.pageProps.userProfile as DeserializedUserDocument
const userProfileData = ref(userProfile.data)
const isReachableEmployee = computed(() => userProfileData.value.kind === "reachable_employee")
const isUnReachableEmployee = computed(() => userProfileData.value.kind === "unreachable_employee")

UserFetcher.initialize("/api")
SignatureFetcher.initialize("/api")
ProfilePictureFetcher.initialize("/api")
EmployeeScheduleFetcher.initialize("/api")

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

	signatureFetcher.renew(
		userProfileData.value.id,
		formData
	).then(() => assignPath("/settings/profile"))
}
function updateUser() {
	new UserFetcher().update(userProfileData.value.id, {
		...userProfileData.value
	}).then(() => assignPath("/settings/profile"))
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

const schedules = userProfile.data.employeeSchedules?.data as DeserializedEmployeeScheduleResource[]

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
