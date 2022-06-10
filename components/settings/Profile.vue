<template>
	<form @submit.prevent>
		<div class ="p-5">
			<h3 class="display-name text-lg">Display Name</h3>
			<h5 class="name">{{ profileInfo.displayName }}</h5>
		</div>
		<div class ="p-5">
			<h3 class="display-name text-lg">Profile Name</h3>
			<div class="picture-container p-1 w-35 h-35 rounded-0.8rem bg-dark-100 flex justify-center">
				<img v-if="profileInfo.profilePic" :src="profileInfo.profilePic">
				<div class="no-image flex flex-col items-center justify-center" v-else>
					<label for="input-profile-pic" >
						<span class="material-icons">add_circle</span>
						<input type="file" accept="image/" id="input-profile-pic" class="input-pic" @change="loadImage($event, 'profilePic')">
					</label>
					<small class="text-center">
						Drag and drop or upload image
					</small>
				</div>
			</div>
		</div>
		<div class ="p-5">
			<h3 class="display-name text-lg">Profile Name</h3>
			<div class="picture-container p-1 w-35 h-35 rounded-0.8rem bg-dark-100 flex justify-center">
				<img v-if="profileInfo.signature" :src="profileInfo.signature">
				<div class="no-image flex flex-col items-center justify-center" v-else>
					<label for="input-signature" >
						<span class="material-icons">add_circle</span>
						<input type="file" accept="image/" id="input-signature" class="input-pic" @change="loadImage($event, 'signature')">
					</label>
					<small class="text-center">
						Drag and drop or upload image
					</small>
				</div>
			</div>
		</div>
		<div class ="p-5 dark-mode-toggle">
			<h3 class="display-name text-lg col-span-full">Dark Mode</h3>
			<p class="name">Click to toggle dark mode</p>
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

	.input-pic {
		display: none;
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
import { ref } from "vue"


const { userInfo } = defineProps<{
	userInfo: {
		[key: string]: any
	}
}>()
const profileInfo = userInfo.profile

const isDarkModeEnabled = ref(true)

function toggleDarkMode() {
	isDarkModeEnabled.value = !isDarkModeEnabled.value
}

function loadImage(e, type) {
	const [file] = e.target.files
	const fileObjectURL = URL.createObjectURL(file)

	if (type === "signature") profileInfo.signature = fileObjectURL
	if (type === "profilePic") profileInfo.profilePic = fileObjectURL
}
</script>
