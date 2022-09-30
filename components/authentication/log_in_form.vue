<template>
	<form>
		<TextualField
			v-model="email"
			label="E-mail"
			class="field email-field"
			type="email"/>
		<PasswordField
			v-model="password"
			label="Password"
			class="field pass-field"/>
		<div v-if="RequestEnvironment.isNotOnProduction">
			Fill details for:

			<RoleSelector
				v-model="selectedRole"
				:options="selectableRoles"
				@update:model-value="fillDetails"/>
		</div>
	</form>
	<div class="controls">
		<!-- TODO: add reset password functionality -->
		<button
			v-if="email && !token"
			id="submit-btn"
			class="btn btn-primary"
			@click="logIn">
			Log in
		</button>
		<a
			id="forgot-btn"
			role="button"
			href="">
			Forgot Password?
		</a>
	</div>

	<div v-if="receivedError" class="error">
		{{ receivedError }}
	</div>
</template>

<style scoped lang="scss">
@import "@styles/btn.scss";
@import "@styles/error.scss";

form {
	@apply text-sm;
	margin: 1em 0 2em;

	.field {
		margin-bottom: 1em;
	}
}
.controls {
	@apply flex flex-col text-xs;
	margin-top: 1em;
	@screen sm {
		@apply flex-row items-center justify-between;

		#submit-btn {
			order: 2;
		}
	}

	#forgot-btn {
		@apply text-gray-800
		text-decoration: underline;
		@screen <sm {
			margin-top: 1em;
		}
	}
	button {
		@apply dark:bg-dark-100;

		padding: 0.5em 1em;
		background-color: gray;
		color: white;
	}
}
</style>

<script setup lang="ts">
import { ref } from "vue"

import type { UnitError } from "$/types/server"
import type { Serializable } from "$/types/general"

import UserFetcher from "$@/fetchers/user"
import assignPath from "$@/external/assign_path"
import RequestEnvironment from "$/singletons/request_environment"

import PasswordField from "@/fields/sensitive_text.vue"
import TextualField from "@/fields/non-sensitive_text.vue"
import RoleSelector from "@/fields/selectable_options.vue"

UserFetcher.initialize("/api")

const props = defineProps<{
	receivedErrorFromPageContext?: UnitError & Serializable
}>()

const email = ref("sample@example.com")
const password = ref("12345678")
const token = ref("")
const receivedError = ref(
	props.receivedErrorFromPageContext
		? props.receivedErrorFromPageContext.detail
		: ""
)

function logIn() {
	const details = {
		"email": email.value,
		"password": password.value
	}

	new UserFetcher().logIn(details)
	.then(() => assignPath("/"))
	.catch(({ "body": { errors } }) => {
		const error = errors[0].detail
		receivedError.value = error
	})
}

const selectableRoles = [
	{ "value": "student" },
	{ "value": "dean" },
	{ "value": "secretary" },
	{ "value": "admin" }
]
const selectedRole = ref("")
function fillDetails() {
	email.value = `${selectedRole.value}@example.net`
	password.value = "password"
}
</script>
