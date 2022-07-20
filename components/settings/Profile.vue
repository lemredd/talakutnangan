<template>
	<form @submit.prevent class="flex flex-col">
		<div>
			<TextualField
				label="Display Name"
				type="text"
				:editable="true"
				v-model="profileInfo.displayName"
			/>
		</div>
		<div>
			<h3 class="display-name text-lg">Profile Picture</h3>
			<div class="picture-container relative p-1 w-35 h-35 rounded-0.8rem bg-dark-100 flex justify-center">
				<img v-if="profileInfo.profilePic" :src="profileInfo.profilePic">
				<div class="no-image flex justify-center" v-else>
					<label for="input-profile-pic" class="flex flex-col items-center justify-center">
						<span class="material-icons">add_circle</span>
						<input type="file" accept="image/" id="input-profile-pic" class="input-pic" @change="loadImage($event, 'profilePic')">
						<small class="text-center">
							Drag and drop or upload image
						</small>
					</label>
				</div>
			</div>
		</div>
		<div>
			<h3 class="display-name text-lg">Signature</h3>
			<div class="picture-container p-1 w-35 h-35 rounded-0.8rem bg-dark-100 flex justify-center">
				<img v-if="profileInfo.signature" :src="profileInfo.signature">
				<div class="no-image flex justify-center" v-else>
					<label for="input-signature" class="flex flex-col items-center justify-center">
						<span class="material-icons">add_circle</span>
						<input type="file" accept="image/" id="input-signature" class="input-pic" @change="loadImage($event, 'signature')">
						<small class="text-center">
							Drag and drop or upload image
						</small>
					</label>
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
		<div class ="p-5">
			<h3 class="display-name text-lg col-span-full">Consultation Schedules</h3>
			<h3 class="display-name text-lg col-span-full">Day</h3>
			<label for="start">From: 
			<input type="time" id="appt" name="appt"
       		min="09:00" max="18:00" required>
			</label>
			<label for="start">To: 
			<input type="time" id="appt" name="appt"
       		min="09:00" max="18:00" required>
			</label>
			
		</div>
	</form>
</template>

<style scoped lang="scss">
form {
	max-width: 640px;

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
		@apply flex flex-row-reverse;
		cursor: pointer;

		input {
			appearance: none;
		}
	}
}
</style>

<script setup lang="ts">
import { inject, Ref, ref } from "vue"
import TextualField from "@/fields/Textual.vue"

const userInfo = inject("userInfo") as Ref<{ [key:string]: any }>
const profileInfo = userInfo.value.profile

const bodyClasses = inject("bodyClasses") as Ref<string[]>
const isDarkModeEnabled = ref(bodyClasses.value.includes("dark"))
function toggleDarkMode() {
	const mutatedBodyClasses = new Set([ ...bodyClasses.value ])
	if (!mutatedBodyClasses.has("dark")) {
		mutatedBodyClasses.add("dark")
	} else {
		mutatedBodyClasses.delete("dark")
	}

	bodyClasses.value = [...mutatedBodyClasses]
}

function loadImage(e: Event, type: string) {
	const target = e.target as HTMLInputElement
	const [file] = target.files!
	const fileObjectURL = URL.createObjectURL(file)

	if (type === "signature") profileInfo.signature = fileObjectURL
	if (type === "profilePic") profileInfo.profilePic = fileObjectURL
}
</script>
