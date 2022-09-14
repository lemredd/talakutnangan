<template>
	<form>
		<TextualField
			v-model="email"
			label="E-mail"
			type="email"/>
		<PasswordField
			v-model="password"
			label="Password"
			type="password"/>
		<div v-if="RequestEnvironment.isNotOnProduction">
			<button type="button" @click="fillStudent">
				Fill Student Details
			</button>
		</div>
	</form>
	<div class="controls">
		<a href="">Forgot Password?</a>
		<button
			v-if="email && !token"
			id="submit-btn"
			@click="logIn">
			Log in
		</button>
	</div>
</template>

<style scoped lang="scss">
.controls {
	@apply flex items-center justify-between;
	margin-top: 1em;

	button {
		@apply dark:bg-dark-100;
		border-radius: .5em;
		padding: 0.5em 1em;
		background-color: gray;
		color: white;
	}
}
</style>

<script setup lang="ts">
import { ref } from "vue"

import UserFetcher from "$@/fetchers/user"
import RequestEnvironment from "$/singletons/request_environment"

import TextualField from "@/fields/non-sensitive_text.vue"
import PasswordField from "@/fields/textual.vue"

const email = ref("sample@example.com")
const password = ref("12345678")
const token = ref("")

UserFetcher.initialize("/api")

function logIn() {
	const details = {
		"email": email.value,
		"password": password.value
	}

	new UserFetcher().logIn(details)
	.then(unusedData => {
		window.location.assign("/")
	}).catch(unusedErrors => {
		// Show error infos
	})
}

function fillStudent() {
	email.value = "student@example.net"
	password.value = "password"
}
</script>
