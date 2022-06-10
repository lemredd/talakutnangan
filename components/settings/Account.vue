<template>
<form @submit.prevent class="flex flex-col items-left text-light-100">
	<div class ="p-5 flex justify-between">
		<TextualField label="E-mail" type="email"  v-model="email"/>
		<button class="material-icons">edit</button>
	</div>
	<div class ="p-5 flex justify-between">
		<TextualField label="Password" type="password" v-model="password"/>
		<button class="material-icons">edit</button>
	</div>
	<div class ="p-5 flex justify-between">
		<TextualField label="Student Number" type="text" v-model="studentNo" :disabled="true"/>
	</div>
	<div class ="p-5 flex justify-between">
		<TextualField label="Institute" type="text" v-model="institute" :disabled="true"/>
	</div>
	<div class ="p-5 flex justify-between">
		<TextualField label="Roles" type="text" v-model="role"/>
	</div>
</form>
</template>

<style lang="scss">
form {
	display: flex;
	flex-direction: column;
	max-width: 480px;

	.input-header {
		font-size: 1.25em;
	}
	.role {
		border-radius: 2em;
		padding: .5em 1em;
		width: max-content;
	}
}
</style>

<script setup lang="ts">
import { ref } from "vue"
import TextualField from "@/fields/Textual.vue"


const email = ref("sample@sample.com")
const password = ref("password123")
const studentNo = ref("1920-xxxx")
const institute = ref("Institute of Name")
const role = ref ("Roles")
</script>
