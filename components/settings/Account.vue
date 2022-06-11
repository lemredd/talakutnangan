<template>
<form @submit.prevent class="flex flex-col items-left text-light-100">
	<div class ="p-5 flex justify-between">
		<TextualField label="E-mail" type="email" :editable="true" v-model="accountInfo.email"/>

	</div>
	<div class ="p-5 flex justify-between">
		<TextualField label="Password" type="password" v-model="accountInfo.password"/>

	</div>
	<div v-if="accountInfo.role === 'student'" class ="p-5 flex justify-between">
		<TextualField label="Student Number" type="text" v-model="accountInfo.studentNumber" :disabled="true"/>
	</div>
	<div class ="p-5 flex justify-between">
		<TextualField label="Institute" type="text" v-model="accountInfo.institute" :disabled="true"/>
	</div>
	<div class ="p-5 flex flex-col justify-between">
		<h3 class="input-header">Roles</h3>
		<span class="role bg-white text-black">{{ accountInfo.role }}</span>
	</div>
</form>
</template>

<style lang="scss">
form {
	display: flex;
	flex-direction: column;
	max-width: 640px;

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
import TextualField from "@/fields/Textual.vue"

const { userInfo } = defineProps<{
	userInfo: {
		[key: string]: any
	}
}>()
const accountInfo = userInfo.account
</script>
