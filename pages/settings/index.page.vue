<template>
<div>
	<header class="mb-5">
		<h1 class="my-5 text-[1.75em] uppercase">User Settings</h1>
		<ul class="tabs">
			<li>Account</li>
			<li>Profile</li>
		</ul>
	</header>
	 <main class="rounded-0.8rem w-100% h-50% bg-dark-500">
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
			 <TextualField label="Student Number" type="text" v-model="studentNo"/>
			 </div>
			 <div class ="p-5 flex justify-between">
			 <TextualField label="Institute" type="text" v-model="institute"/>
			 </div>
			 <div class ="p-5 flex justify-between">
			 <TextualField label="Roles" type="text" v-model="role"/>
			 </div>
		 </form>
	 </main>
	<main class="bg-dark-500">
		<form>
			<div class ="p-5">
				<h3 class="display-name text-lg">Display Name</h3>
				<h5 class="name">Sample Display F. Name</h5>
			</div>
			<div class ="p-5">
				<h3 class="display-name text-lg">Profile Name</h3>
				<div class="picture-container p-1 w-35 h-35 rounded-0.8rem bg-dark-100 flex flex-col items-center justify-center">
					<div class="image"></div>
					<button class="material-icons">add_circle</button>
					<small class="text-center">Drag and drop or upload image</small>
				</div>
			</div>
			<div class ="p-5">
				<h3 class="display-name text-lg">Signature</h3>
				<div class="picture-container p-1 w-35 h-35 rounded-0.8rem bg-dark-100 flex flex-col items-center justify-center">
					<div class="image"></div>
					<button class="material-icons">add_circle</button>
					<small class="text-center">Drag and drop or upload image</small>
				</div>
			</div>
			<div class ="p-5 dark-mode-toggle">
				<h3 class="display-name text-lg col-span-full">Dark Mode</h3>
				<p class="name">Lorem5</p>
				<label for="dark-mode-toggle">
					<span class="material-icons-outlined">
						{{ `toggle_${isDarkModeEnabled ? "on" : "off"}` }}
					</span>
					<input type="checkbox" name="" id="dark-mode-toggle" v-model="isDarkModeEnabled" @click="toggleDarkMode">
				</label>
			</div>
		</form>

	 </main>

</div>
</template>

<style scoped lang="scss">
main {
	border-radius: 8px;

	form {
		display: flex;
		flex-direction: column;
		max-width: 480px;
	}
}
	.dark-mode-toggle {
		display: grid;
		grid-template:
			"formHeader formHeader"
			"subtitle toggle";

		h3 {
			grid-area: formHeader;
		}

		h5 {
			grid-area: subtitle;
		}

		label {
			display: flex;
			flex-direction: row-reverse;
			cursor: pointer;

			input {
				appearance: none;
			}
		}
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
