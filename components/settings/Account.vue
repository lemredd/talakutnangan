<template>
<form @submit.prevent class="text-light-100">
	<div>
		<TextualField
			label="E-mail"
			type="email"
			:editable="true"
			:verify="true"
			v-model="accountInfo.email"
			/>
	</div>
	<div>
		<TextualField label="Password" type="password" v-model="accountInfo.password"/>

	</div>
	<div v-if="accountInfo.role === 'student'">
		<TextualField label="Student Number" type="text" v-model="accountInfo.studentNumber" :disabled="true"/>
	</div>
	<div>
		<TextualField label="Institute" type="text" v-model="accountInfo.institute" :disabled="true"/>
	</div>
	<div>
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
