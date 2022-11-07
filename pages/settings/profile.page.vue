<template>
	<SettingsHeader title="User Settings" :tab-infos="settingsTabInfos"/>

	<ReceivedErrors v-if="receivedErrors.length" :received-errors="receivedErrors"/>
	<ReceivedSuccessMessages
		v-if="successMessages.length"
		:received-success-messages="successMessages"/>
	<div class="profile-account">
		<h1 class="text-xl mb-8">General Profile Info</h1>
		<div>
			<TextualField
				v-model="userProfileData.name"
				v-model:status="nameFieldStatus"
				label="Display Name"
				class="display-name-field"
				type="text"/>
		</div>

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
						class="input-profile-picture">
						<span class="material-icons">add_circle</span>
						<small class="upload-replace">
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
						class="input-signature">
						<span class="material-icons">add_circle</span>
						<small class="upload-replace signatures">
							upload or replace image
						</small>
					</label>
				</div>

				<Signature class="signature-picker-sm"/>
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
			<button class="submit-btn btn btn-primary mt-4 mb-8" @click="updateUser">
				submit
			</button>
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

<style lang="scss">
	.wrapper {
		margin-bottom: 50vh !important;
	}
</style>

<style scoped lang="scss">
	@import "@styles/btn.scss";
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

	.input-profile-picture,.input-signature{
		@apply flex flex items-center;
	}

	.upload-replace{
		@apply text-center ml-1;

		&.signatures{
			@apply underline;
		}
	}

	.profile, .signature{
		font-size: 1.5em;
	}

	.profile-picker-sm, .signature-picker-sm{
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
import { ref, Ref, inject, computed } from "vue"

import type { FieldStatus } from "@/fields/types"
import type { PageContext } from "$/types/renderer"
import type { DeserializedUserDocument } from "$/types/documents/user"
import type { DeserializedEmployeeScheduleResource } from "$/types/documents/employee_schedule"

import { BODY_CLASSES } from "$@/constants/provided_keys"
import settingsTabInfos from "@/settings/settings_tab_infos"

import UserFetcher from "$@/fetchers/user"
import assignPath from "$@/external/assign_path"
import SignatureFetcher from "$@/fetchers/signature"
import BodyCSSClasses from "$@/external/body_css_classes"
import ProfilePictureFetcher from "$@/fetchers/profile_picture"
import RequestEnvironment from "$/singletons/request_environment"

import Signature from "@/helpers/signature.vue"
import PicturePicker from "@/fields/picture_picker.vue"
import TextualField from "@/fields/non-sensitive_text.vue"
import ProfilePicture from "@/helpers/profile_picture.vue"
import SettingsHeader from "@/helpers/tabbed_page_header.vue"
import SchedulePickerGroup from "@/settings/schedule_picker_group.vue"
import ReceivedErrors from "@/helpers/message_handlers/received_errors.vue"
import ReceivedSuccessMessages from "@/helpers/message_handlers/received_success_messages.vue"

import { DayValues } from "$/types/database"
import { UnitError } from "$/types/server"

const bodyClasses = inject(BODY_CLASSES) as Ref<BodyCSSClasses>
const pageContext = inject("pageContext") as PageContext<"deserialized">

const userProfile = pageContext.pageProps.userProfile as DeserializedUserDocument
const userProfileData = ref(userProfile.data)
const isReachableEmployee = computed(() => userProfileData.value.kind === "reachable_employee")
const isUnReachableEmployee = computed(() => userProfileData.value.kind === "unreachable_employee")

const nameFieldStatus = ref<FieldStatus>("locked")

const receivedErrors = ref<string[]>([])
const successMessages = ref<string[]>([])

function showSuccessMessage(message: string) {
	if (receivedErrors.value.length) receivedErrors.value = []
	successMessages.value.push(message)
}

function submitProfilePicture(formData: FormData) {
	const profilePictureFetcher = new ProfilePictureFetcher()

	if (userProfileData.value.profilePicture) {
		profilePictureFetcher.updateFile(
			userProfileData.value.profilePicture.data.id,
			formData
		)
		.then(() => {
			const message = "profile picture uploaded successfully. reload the page to see the changes"
			showSuccessMessage(message)
		})
		.catch(({ body }) => {
			if (successMessages.value.length) successMessages.value = []
			if (body) {
				const { errors } = body
				receivedErrors.value = errors.map((error: UnitError) => {
					const readableDetail = error.detail

					return readableDetail
				})
			} else {
				receivedErrors.value = [ "an error occured" ]
			}
		})
	} else {
		profilePictureFetcher.createFile(
			userProfileData.value.id,
			formData
		)
		.then(() => {
			const message = "profile picture uploaded successfully. reload the page to see the changes"
			showSuccessMessage(message)
		})
		.catch(({ body }) => {
			if (successMessages.value.length) successMessages.value = []
			if (body) {
				const { errors } = body
				receivedErrors.value = errors.map((error: UnitError) => {
					const readableDetail = error.detail

					return readableDetail
				})
			} else {
				receivedErrors.value = [ "an error occured" ]
			}
		})
	}
}
function submitSignature(formData: FormData) {
	const signatureFetcher = new SignatureFetcher()

	signatureFetcher.renew(
		userProfileData.value.id,
		formData
	)
	.then(() => {
		const message = "Signature uploaded successfully. reload the page to see the changes"
		showSuccessMessage(message)
	})
	.catch(({ body }) => {
		if (successMessages.value.length) successMessages.value = []
		if (body) {
			const { errors } = body
			receivedErrors.value = errors.map((error: UnitError) => {
				const readableDetail = error.detail

				return readableDetail
			})
		} else {
			receivedErrors.value = [ "an error occured" ]
		}
	})
}

function updateUser() {
	new UserFetcher().update(userProfileData.value.id, {
		...userProfileData.value
	})
	.then(() => {
		// eslint-disable-next-line max-len
		showSuccessMessage("Your profile has been updated successfully. Please wait until the page reloads.")
		const SECONDS_BEFORE_PAGES_RELOAD = 3000
		setTimeout(() => assignPath("/settings/profile"), SECONDS_BEFORE_PAGES_RELOAD)
	})
	.catch(({ body }) => {
		if (successMessages.value.length) successMessages.value = []
		if (body) {
			const { errors } = body
			receivedErrors.value = errors.map((error: UnitError) => {
				const readableDetail = error.detail

				return readableDetail
			})
		} else {
			receivedErrors.value = [ "an error occured" ]
		}
	})
}

const emit = defineEmits([ "toggleDarkMode" ])

const prefersDark = ref(userProfileData.value.prefersDark)
function toggleDarkMode() {
	if (RequestEnvironment.isOnTest) {
		emit("toggleDarkMode")
	}

	const mutatedBodyClasses = new Set([ ...bodyClasses.value.bodyClasses ])
	if (mutatedBodyClasses.has("dark")) {
		bodyClasses.value.lighten()
	} else {
		bodyClasses.value.darken()
	}

	userProfileData.value.prefersDark = !userProfileData.value.prefersDark
}

const schedules = userProfile.data.employeeSchedules?.data as DeserializedEmployeeScheduleResource[]
</script>
