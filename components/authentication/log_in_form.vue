<template>
	<div class="login-form">
		<ul v-if="receivedErrors.length" class="status-messages error">
			<div v-if="receivedErrorFromPageContext" class="from-page-context">
				{{ receivedErrors }}
			</div>
			<div v-else class="from-input-validation">
				<h3>The following errors have occured:</h3>
				<li
					v-for="error in receivedErrors"
					:key="receivedErrors.indexOf(error)">
					{{ error }}
				</li>
			</div>
		</ul>
		<h1>log in</h1>

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
			<button
				id=""
				:disabled="!email"
				class="submit-btn btn btn-primary"
				@click="logIn">
				Log in
			</button>
			<button
				role="button">
				Forgot Password?
			</button>
		</div>
	</div>
</template>

<style scoped lang="scss">
@import "@styles/btn.scss";
@import "@styles/status_messages.scss";
@import "@styles/variables.scss";

.login-form {
	@apply dark:bg-dark-700;
	background: white;
	width: 100%;
	max-width: 1200px;
	margin: 0 2em;
	padding: 1em 2em;
	z-index: 1;


	@screen sm {
		width: initial;
		margin: auto 0;
	}

	h1 {
		font-size: 2em;
		text-transform: uppercase;
	}
}

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

		.submit-btn {
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
import { Ref, ref } from "vue"

import type { UnitError } from "$/types/server"
import type { Serializable } from "$/types/general"

import RequestEnvironment from "$/singletons/request_environment"

import UserFetcher from "$@/fetchers/user"
import assignPath from "$@/external/assign_path"
import extractAllErrorDetails from "$@/helpers/extract_all_error_details"

import PasswordField from "@/fields/sensitive_text.vue"
import TextualField from "@/fields/non-sensitive_text.vue"
import RoleSelector from "@/fields/selectable_options.vue"

const props = defineProps<{
	receivedErrorFromPageContext?: UnitError & Serializable
}>()

const email = ref("")
const password = ref("")
const receivedErrors = ref<string|string[]>(
	props.receivedErrorFromPageContext
		? props.receivedErrorFromPageContext.detail
		: []
)

function logIn() {
	const details = {
		"email": email.value,
		"password": password.value
	}

	new UserFetcher().logIn(details)
	.then(() => assignPath("/"))
	.catch(response => {
		extractAllErrorDetails(response, receivedErrors as Ref<string[]>)

		if (response.status === RequestEnvironment.status.UNAUTHORIZED) {
			response.value = [ "Invalid e-mail or password" ]
		}
	})
}

const defaultProfessor = "default_professor"
const selectableRoles = [
	{ "value": "student" },
	{ "value": "dean" },
	{ "value": "secretary" },
	{ "value": "admin" },
	{ "value": "default_professor" }
]
const selectedRole = ref("")
function fillDetails() {
	email.value = `${selectedRole.value}@example.net`
	password.value = selectedRole.value === defaultProfessor ? defaultProfessor : "password"
}
</script>
