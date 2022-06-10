<template>
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
</template>

<style scoped lang="scss">
form {
	display: flex;
	flex-direction: column;
	max-width: 480px;
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
import { ref } from "vue"
const isDarkModeEnabled = ref(true)

function toggleDarkMode() {
	isDarkModeEnabled.value = !isDarkModeEnabled.value
}
</script>
