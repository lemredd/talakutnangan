<template>
	<form>
		<TextualField label="E-mail" type="email" v-model="email"/>
		<TextualField label="Password" type="password" v-model="password"/>
	</form>
	<div class="controls">
		<a href="">Forgot Password?</a>
		<button v-if="email && !token" @click="logIn">
			Log in
		</button>
	</div>
</template>

<style scoped lang="scss">
.controls {
	display: flex;
	align-items: center;
	justify-content: space-between;

	button {
		border-radius: .5em;
		padding: 0.5em 1em;

		background-color: #444;
	}
}
</style>

<script setup lang="ts">
import { ref, computed } from "vue"
import TextualField from "@/fields/Textual.vue"

const email = ref("sample@example.com")
const password = ref("12345678")
const token = ref("")

const status = computed(() => email.value === ""? "not logged in": "logged in")

function logIn() {
	fetch("/api/user/log_in", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			email: email.value,
			password: password.value
		})
	})
	.then(response => response.json())
	.then(({ rawToken }) => {
		console.info("checked availability..."+rawToken)

		token.value = rawToken
	})
}
</script>
