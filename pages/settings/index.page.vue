<template>
<div>
	<header class="mb-5">
		<h1 class="my-5 text-[1.75em] uppercase">User Settings</h1>
		<ul class="tabs">
			<li>Account</li>
			<li>Profile</li>
		</ul>
	</header>

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
import { ref, computed } from "vue"
import TextualField from "@/fields/Textual.vue"

const email = ref("sample@sample.com")
const password = ref("password123")
const studentNo = ref("1920-xxxx")
const institute = ref("Institute of Name")
const role = ref ("Roles")
const isDarkModeEnabled = ref(true)

function toggleDarkMode() {
	isDarkModeEnabled.value = !isDarkModeEnabled.value
}
</script>
