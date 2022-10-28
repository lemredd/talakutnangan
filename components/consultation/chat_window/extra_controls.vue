<template>
	<Dropdown
		:is-dropdown-shown="isHeaderControlDropdownShown"
		class="additional-controls"
		@toggle="toggleHeaderControlDropdownShown">
		<template #toggler>
			<button class="material-icons toggle-controls-btn">
				more_horiz
			</button>
		</template>

		<template #dropdown-contents>
			<div class="links">
				<a
					href="#"
					class="additional-control view-printable-form-btn">
					View consultation form
				</a>
				<a
					v-if="isCurrentUserConsultant"
					href="#"
					class="additional-control view-action-taken-overlay-btn"
					@click="showActionTakenOverlay">Finish consultation</a>
			</div>
		</template>
	</Dropdown>
</template>

<script setup lang="ts">

import Dropdown from "@/page_shell/dropdown.vue"

defineProps<{
	isHeaderControlDropdownShown: boolean,
	isCurrentUserConsultant: boolean
}>()

interface CustomEvents {
	(eventName: "toggleHeaderControlDropdownShown"): void
	(eventName: "showActionTakenOverlay"): void
}

const emit = defineEmits<CustomEvents>()

function showActionTakenOverlay() {
	emit("showActionTakenOverlay")
}

function toggleHeaderControlDropdownShown() {
	emit("toggleHeaderControlDropdownShown")
}
</script>
