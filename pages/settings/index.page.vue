<template>
<div>
	<header class="mb-5">
		<h1 class="my-5 text-[1.75em] uppercase">User Settings</h1>
	</header>

	<main>
		<Tab :tabs="tabs" />
	</main>
</div>
</template>

<style>

</style>

<script setup lang="ts">
import { provide, ref } from "vue"
import Tab from "@/Tab.vue"
import Account from "@/settings/Account.vue"
import Profile from "@/settings/Profile.vue"

const tabs = {
	Account,
	Profile
}
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

provide("userInfo", userInfo.value)
</script>
