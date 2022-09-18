<template>
	<SensitiveText
		v-model="mockPassword"
		label="Password"
		:editable="true">
		<template #hidden-dialog>
			<Overlay :is-shown="isOverlayShown" @close="cancel">
				<template #header>
					<h1>Update your password</h1>
				</template>
				<template #default>
					<form class="verification">
						<SensitiveText
							v-model="currentPassword"
							label="Current password"
							placeholder="enter your current password"/>
						<SensitiveText
							v-model="newPassword"
							label="New password"
							placeholder="enter your new password"/>
						<SensitiveText
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
	</SensitiveText>
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
import { ref } from "vue"

import Overlay from "@/helpers/overlay.vue"
import SensitiveText from "@/fields/sensitive_text.vue"

const mockPassword = ref<string>("00000000")
const isOverlayShown = ref<boolean>(false)
const currentPassword = ref<string>("")
const newPassword = ref<string>("")
const confirmNewPassword = ref<string>("")

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
	isOverlayShown.value = false
}

function savePassword() {
	//
}
</script>
