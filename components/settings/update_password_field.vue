<template>
	<SensitiveTextField
		v-model="mockPassword"
		label="Password"
		:editable="true"
		@request-edit="open">
		<template #hidden-dialog>
			<Overlay :is-shown="isOverlayShown" @close="cancel">
				<template #header>
					<h1>Update your password</h1>
				</template>
				<template #default>
					<ReceivedErrors v-if="receivedErrors.length" :received-errors="receivedErrors"/>
					<ReceivedSuccessMessages
						v-if="successMessages.length"
						:received-success-messages="successMessages"/>
					<form class="verification">
						<SensitiveTextField
							v-model="currentPassword"
							label="Current password"
							placeholder="enter your current password"/>
						<SensitiveTextField
							v-model="newPassword"
							label="New password"
							placeholder="enter your new password"/>
						<SensitiveTextField
							v-model="confirmNewPassword"
							label="Confirm new password"
							placeholder="confirm your new password"/>
					</form>
				</template>
				<template #footer>
					<button type="button" @click="cancel">
						Cancel
					</button>
					<button type="button" @click="savePassword">
						Save password
					</button>
				</template>
			</Overlay>
		</template>
	</SensitiveTextField>
</template>

<style scoped lang="scss">
.verification {
	@apply flex flex-col text-black;
	@apply dark:text-light-500;

	label {
		padding: .5em 1em;

		input {
			padding: .25em .5em;
		}
	}
}
</style>

<script setup lang="ts">
import { ref, inject, Ref } from "vue"

import type { PageContext } from "$/types/renderer"

import { BODY_CLASSES } from "$@/constants/provided_keys"
import { MILLISECOND_IN_A_SECOND } from "$/constants/numerical"

import isUndefined from "$/type_guards/is_undefined"

import Fetcher from "$@/fetchers/user"
import makeSwitch from "$@/helpers/make_switch"
import BodyCSSClasses from "$@/external/body_css_classes"
import fillSuccessMessages from "$@/helpers/fill_success_messages"
import extractAllErrorDetails from "$@/helpers/extract_all_error_details"

import Overlay from "@/helpers/overlay.vue"
import SensitiveTextField from "@/fields/sensitive_text.vue"
import ReceivedErrors from "@/helpers/message_handlers/received_errors.vue"
import ReceivedSuccessMessages from "@/helpers/message_handlers/received_success_messages.vue"

const pageContext = inject("pageContext") as PageContext<"deserialized">
const { pageProps } = pageContext
const { userProfile } = pageProps

const mockPassword = ref<string>("00000000")
const {
	"off": closeDialog,
	"on": openDialog,
	"state": isOverlayShown
} = makeSwitch(false)
const currentPassword = ref<string>("")
const newPassword = ref<string>("")
const confirmNewPassword = ref<string>("")

const fetcher: Fetcher = new Fetcher()

function clearPasswords(): void {
	[
		currentPassword,
		newPassword,
		confirmNewPassword
	].forEach(password => {
		password.value = ""
	})
}

const bodyClasses = inject(BODY_CLASSES) as Ref<BodyCSSClasses>
function open() {
	setTimeout(() => {
		openDialog()
		if (!isUndefined(window)) bodyClasses.value.scroll(false)
	}, MILLISECOND_IN_A_SECOND)
}

const receivedErrors = ref<string[]>([])
const successMessages = ref<string[]>([])

function cancel(): void {
	clearPasswords()
	closeDialog()
}

function savePassword() {
	fetcher.updatePassword(
		userProfile.data.id,
		currentPassword.value,
		newPassword.value,
		confirmNewPassword.value
	).then(() => {
		const TIMEOUT = 3000
		fillSuccessMessages(receivedErrors, successMessages)
		setTimeout(closeDialog, TIMEOUT)
	})
	.catch(responseWithErrors => extractAllErrorDetails(responseWithErrors, receivedErrors))
}
</script>
