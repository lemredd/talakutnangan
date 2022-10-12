<template>
	<SensitiveTextField
		v-model="mockPassword"
		label="Password"
		:editable="true"
		@request-edit="openDialog">
		<template #hidden-dialog>
			<Overlay :is-shown="isOverlayShown" @close="cancel">
				<template #header>
					<h1>Update your password</h1>
				</template>
				<template #default>
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

	label {
		padding: .5em 1em;

		input {
			padding: .25em .5em;
		}
	}
}
</style>

<script setup lang="ts">
import { ref, inject } from "vue"

import type { PageContext } from "$/types/renderer"

import Fetcher from "$@/fetchers/user"
import makeSwitch from "$@/helpers/make_switch"

import Overlay from "@/helpers/overlay.vue"
import SensitiveTextField from "@/fields/sensitive_text.vue"

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
	).then(cancel)
}
</script>
