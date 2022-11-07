<template>
	<Overlay :is-shown="isOverlayShown" @close="cancel">
		<template #header>
			<h1>Update your password</h1>
		</template>
		<template #default>
			<ReceivedErrors v-if="receivedErrors.length" :received-errors="receivedErrors"/>
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

				<button
					class="btn btn-primary"
					type="button"
					@click="savePassword">
					Save password
				</button>
			</form>
		</template>
		<template #footer>
		</template>
	</Overlay>
</template>

<style lang="scss">
	.overlay-footer {
		@apply flex-row-reverse;
	}
</style>

<style scoped lang="scss">
	@import "@styles/btn.scss";

	.verification {
		@apply flex flex-col text-black;

		label {
			padding: .5em 1em;

			input {
				padding: .25em .5em;
			}
		}
	}
</style>

<script setup lang="ts">
import { Ref, ref, inject, onMounted } from "vue"

import type { PageContext } from "$/types/renderer"
import type { UnitError } from "$/types/server"

import { BODY_CLASSES } from "$@/constants/provided_keys"

import isUndefined from "$/type_guards/is_undefined"

import Fetcher from "$@/fetchers/user"
import makeSwitch from "$@/helpers/make_switch"
import BodyCSSClasses from "$@/external/body_css_classes"

import Overlay from "@/helpers/overlay.vue"
import SensitiveTextField from "@/fields/sensitive_text.vue"
import ReceivedErrors from "@/helpers/message_handlers/received_errors.vue"

const pageContext = inject("pageContext") as PageContext<"deserialized">
const { pageProps } = pageContext
const { userProfile } = pageProps

const {
	"off": closeDialog,
	"on": openDialog,
	"state": isOverlayShown
} = makeSwitch(false)
const currentPassword = ref<string>("")
const newPassword = ref<string>("")
const confirmNewPassword = ref<string>("")
const bodyClasses = inject(BODY_CLASSES) as Ref<BodyCSSClasses>

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

const receivedErrors = ref<string[]>([])
const successMessages = ref<string[]>([])
function cancel(): void {
	if (receivedErrors.value.length) receivedErrors.value = []
	bodyClasses.value.scroll(true)
	clearPasswords()
	closeDialog()
}
function savePassword() {
	fetcher.updatePassword(
		userProfile.data.id,
		currentPassword.value,
		newPassword.value,
		confirmNewPassword.value
	)
	.then(cancel)
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

onMounted(() => {
	if (userProfile.meta.hasDefaultPassword) {
		const TIMEOUT = 3000

		setTimeout(() => {
			openDialog()
			if (!isUndefined(window)) bodyClasses.value.scroll(false)
		}, TIMEOUT)
	}
})
</script>
