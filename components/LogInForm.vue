<template>
	<form>
		<label>
			E-mail: <input type="email" name="email" v-model="email"/>
		</label>
		<label>
			Password: <input type="password" name="password"/>
		</label>
		<output>
			Status: {{ status }}
		</output>
	</form>
	<button v-if="!hasUser" @click="logIn">
		Log in
	</button>

</template>

<script setup lang="ts">
import { ref, computed } from "vue"
// const sessionID = useCookie("session")

// console.log("email: "+JSON.stringify(sessionID))
const email = ref("")
const token = ref("")

const status = computed(() => email.value === ""? "not logged in": "logged in")
const hasUser = computed(() => email.value)

function logIn() {
	console.info("checking availability...")
	useFetch("api/log_in", {
		method: "POST",
		body: {
			email: email.value
		}
	}).then(({ data: rawToken }) => {
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
