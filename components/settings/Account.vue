<template>
<form @submit.prevent class="text-dark-200 dark:text-light-100 flex flex-col">
		<TextualField
			label="E-mail"
			type="email"
			:editable="true"
			:verify="true"
			v-model="accountInfo.email"
			/>
		<TextualField
		label="Password"
		type="password"
		:editable="true"
		:verify="true"
		v-model="accountInfo.password"/>

		<TextualField v-if="accountInfo.role === 'student'" label="Student Number" type="text" v-model="accountInfo.studentNumber" :disabled="true"/>
		<TextualField label="Institute" type="text" v-model="accountInfo.institute" :disabled="true"/>
	<div>
		<h3 class="input-header">Roles</h3>
		<span class="role bg-white text-black">{{ accountInfo.role }}</span>
	</div>
</form>
</template>

<style lang="scss">
@import "@styles/variables.scss";

form {
	max-width: $mobile-viewport;

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
import { inject, Ref } from "vue"

const userInfo = inject("userInfo") as Ref<{ [key: string]: any }>
const accountInfo = userInfo.value.account
</script>
