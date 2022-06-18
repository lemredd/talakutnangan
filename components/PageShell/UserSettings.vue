<template>
	<div class="user-settings">
		<a id="notification-btn" role="button" @click="toggleSettingsList" class="material-icons">
			account_circle
		</a>
		<SettingsList v-if="isSettingsListShown" @close="toggleSettingsList">
			<ul class="settings-items">
					<a href="">
						Account Settings
					</a>
					<a href="">
						Profile Settings
					</a>
					<a href="">
						Logout
					</a>
			</ul>
		</SettingsList>
	</div>
</template>

<style lang="scss">
.user-settings {
	height: 30px;
	padding: 3px 10px;
	align-self: center;
	position: relative;

	.dropdown-container {
		position: absolute;
		top: 56px;
		right: 0;
		width: max-content;

		.settings-items {
			display: flex;
			flex-direction: column;
		}
	}
}


</style>

<script setup lang="ts">
import SettingsList from "@/Dropdown.vue"
import { ref } from "vue"

type Emissions = {
	(e: "toggleSettingsList", isSettingsListShown: boolean ): void
}
const emit = defineEmits<Emissions>()

const isSettingsListShown = ref(false)

function toggleSettingsList() {
	isSettingsListShown.value = !isSettingsListShown.value
	emit("toggleSettingsList", isSettingsListShown.value) // for testing purposes
}
</script>
