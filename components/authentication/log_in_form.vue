<template>
	<form>
		<TextualField
			v-model="email"
			label="E-mail"
			type="email"/>
		<TextualField
			v-model="password"
			label="Password"
			type="password"/>
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
import TextualField from "@/fields/textual.vue"

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
	.then(console.log)
}
</script>