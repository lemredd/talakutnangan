<template>
	<SettingsHeader title="User Settings"/>
	<form class="text-dark-200 dark:text-light-100 flex flex-col" @submit.prevent>
		<TextualField
			v-model="accountInfo.email"
			label="E-mail"
			type="email"
			:editable="true"
			:verify="true"/>
		<TextualField
			v-model="accountInfo.password"
			label="Password"
			type="password"
			:editable="true"
			:verify="true"/>

		<TextualField
			v-if="accountInfo.role === 'student'"
			v-model="accountInfo.studentNumber"
			label="Student Number"
			type="text"
			:disabled="true"/>
		<TextualField
			v-model="accountInfo.institute"
			label="Institute"
			type="text"
			:disabled="true"/>
		<div>
			<h3 class="input-header">
				Roles
			</h3>
			<span class="role bg-white text-black">{{ accountInfo.role }}</span>
		</div>
	</form>
</template>

<style lang="scss">
@import "@styles/variables.scss";

form {
	max-width: $mobileViewportMaximum;

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
import { provide } from "vue"
import TextualField from "@/fields/textual.vue"
import SettingsHeader from "@/tabbed_page_header.vue"

const accountInfo = {
	"email": "email@example.com",
	"password": "password",
	"role": "student",
	"studentNumber": "1920-9999",
	"institute": "INS"
}

provide("tabs", [ "Account", "Profile" ])
</script>
