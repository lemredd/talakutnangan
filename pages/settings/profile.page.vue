<template>
	<SettingsHeader title="User Settings"/>
	<form class="flex flex-col" @submit.prevent>
		<div>
			<TextualField
				v-model="profileInfo.displayName"
				label="Display Name"
				type="text"
				:editable="true"/>
		</div>

		<!-- TODO: Refactor all WindiCSS inline classes using `@apply` directive -->
		<!-- TODO: Refactor HTML to Vue Components if applicable -->
		<div class="pictures">
			<PicturePicker title="Profile Picture" :picture="profileInfo.profilePic"/>
			<PicturePicker title="Signature" :picture="profileInfo.signature"/>
		</div>

		<div class="dark-mode-toggle">
			<h3 class="display-name text-lg col-span-full">
				Dark Mode
			</h3>
			<p class="name">
				Click to toggle dark mode
			</p>
			<label for="dark-mode-toggle">
				<span class="material-icons-outlined">
					{{ `toggle_${isDarkModeEnabled ? "on" : "off"}` }}
				</span>
				<input
					id="dark-mode-toggle"
					v-model="isDarkModeEnabled"
					type="checkbox"
					name=""
					@click="toggleDarkMode"/>
			</label>
		</div>
		<div v-if="isReachableEmployee" class="consultation-schedules p-5">
			<h3 class="display-name text-lg col-span-full">
				Consultation Schedules
			</h3>
			<SchedulePicker
				v-for="schedule in schedules"
				:key="schedules.indexOf(schedule)"
				:day="schedule.day"
				:start-time="schedule.startTime"
				:end-time="schedule.endTime"/>
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
	@apply p-5 grid;
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
import {
	ref,
	Ref,
	inject,
	provide,
	computed
} from "vue"

import type { TabInfo } from "$@/types/component"
import type { PageContext } from "$/types/renderer"
import type { DeserializedUserProfile } from "$/types/documents/user"

import TextualField from "@/fields/textual.vue"
import SettingsHeader from "@/tabbed_page_header.vue"
import PicturePicker from "@/settings/picture_picker.vue"
import SchedulePicker from "@/settings/schedule_picker.vue"

const bodyClasses = inject("bodyClasses") as Ref<string[]>
const pageContext = inject("pageContext") as PageContext

const { "data": userProfile } = pageContext.pageProps.userProfile as DeserializedUserProfile
const { kind } = userProfile
const profileInfo = {
	"displayName": userProfile.name,
	"profilePic": null as string | null,
	"signature": null as string | null
}
const isReachableEmployee = computed(() => kind === "reachable_employee")

const isDarkModeEnabled = ref(bodyClasses.value.includes("dark"))
function toggleDarkMode() {
	const mutatedBodyClasses = new Set([ ...bodyClasses.value ])
	if (mutatedBodyClasses.has("dark")) {
		mutatedBodyClasses.delete("dark")
	} else {
		mutatedBodyClasses.add("dark")
	}

	bodyClasses.value = [ ...mutatedBodyClasses ]
}

const schedules = [
	{
		"day": "monday",
		"endTime": "17:00",
		"startTime": "08:00"
	},
	{
		"day": "tuesday",
		"endTime": "17:00",
		"startTime": "08:00"
	},
	{
		"day": "wednesday",
		"endTime": "17:00",
		"startTime": "08:00"
	}
]

const tabs: TabInfo[] = [
	{
		"label": "Account",
		"path": "/settings/account"
	},
	{
		"label": "Profile",
		"path": "/settings/profile"
	}
]

provide("tabs", tabs)
</script>
