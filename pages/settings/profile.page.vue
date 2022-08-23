<template>
<SettingsHeader title="User Settings" />
	<form @submit.prevent class="flex flex-col">
		<div>
			<TextualField
				label="Display Name"
				type="text"
				:editable="true"
				v-model="profileInfo.displayName"
			/>
		</div>

		<!-- TODO: Refactor all WindiCSS inline classes using `@apply` directive -->
		<!-- TODO: Refactor HTML to Vue Components if applicable -->
		<div class="pictures">
			<PicturePicker title="Profile Picture" :picture="profileInfo.profilePic"/>
			<PicturePicker title="Signature" :picture="profileInfo.signature"/>
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
		<div class ="consultation-schedules p-5">
			<h3 class="display-name text-lg col-span-full">Consultation Schedules</h3>
				<SchedulePicker day="Monday" start-time="08:00" end-time="17:00" />
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
import { inject, Ref, ref, provide } from "vue"

import type { PageContext } from "#/types"
import type { DeserializedUserProfile } from "$/types/documents/user"
import TextualField from "@/fields/textual.vue"
import SettingsHeader from "@/tabbed_page_header.vue"
import PicturePicker from "@/settings/picture_picker.vue"
import SchedulePicker from "@/settings/schedule_picker.vue"

const bodyClasses = inject("bodyClasses") as Ref<string[]>
const pageContext = inject("pageContext") as PageContext

const { "data": userProfile } = pageContext.pageProps.userProfile as DeserializedUserProfile
const profileInfo = {
	displayName: "Sample Name",
	profilePic: null as string | null,
	signature: null as string | null
}

// const userInfo = inject("userInfo") as Ref<{ [key:string]: any }>
// const profileInfo = userInfo.value.profile

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

provide("tabs", ["Account", "Profile"])
</script>
