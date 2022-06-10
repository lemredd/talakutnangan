<template>
<div>
	<header class="mb-5">
		<h1 class="my-5 text-[1.75em] uppercase">User Settings</h1>
		<ul class="tabs">
			<li v-for="(_, tab) in tabs" :key="tab" :class="['tab-button', { 'active': currentTab === tab }]" @click="currentTab = tab">{{ tab }}</li>
		</ul>
	</header>

	<main class="rounded-0.8rem w-100% h-50% bg-dark-500">
		<component :is="tabs[currentTab]" class="tab" :userInfo="userInfo"></component>
	</main>
</div>
</template>

<style scoped lang="scss">
.tabs {
	display: flex;

	.tab-button {
		border-radius: 5px;
		cursor: pointer;
		padding: 0.25em 2em;

		&.active {
			background-color: white;
			color: black;
		}
	}
}
main {
	border-radius: 8px;
}
</style>

<script setup lang="ts">
import { ref } from "vue"
import Account from "@/settings/Account.vue"
import Profile from "@/settings/Profile.vue"

const tabs = {
	Account,
	Profile
}
const currentTab = ref("Account")

const roles = ["student", "employee"]
const role = roles[0]
const userInfo = ref({
	account: {
		email: "sample@sample.com",
		password: "password123",
		institute: "Institute of Name",
		role: role,
		studentNumber: "1920-xxxx",
	},
	profile: {
		displayName: "Sample Display F. Name",
		profilePic: null,
		signature: null,
		prefersDarkMode: true
	}
})
</script>
