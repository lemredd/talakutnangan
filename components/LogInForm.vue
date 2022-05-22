<template>
	<form>
		<TextualField label="E-mail" type="email" v-model="email"/>
		<TextualField label="Password" type="password" v-model="password"/>
		<output>
			Status: {{ status }}
		</output>
	</form>
	<button v-if="email && !token" @click="logIn">
		Log in
	</button>

</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import TextualField from "@/fields/textual.vue"

const email = ref("")
const password = ref("")
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

<style>
label {
	display: block;
}
</style>
