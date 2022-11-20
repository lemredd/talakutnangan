<template>
	<Dropdown
		v-model="modelValue"
		class="additional-controls">
		<template #dropdown-contents>
			<div class="buttons">
				<a
					:href="linkToPrintableForm"
					target="_blank"
					class="additional-control view-printable-form-link">
					View consultation form
				</a>
				<a
					v-if="mustShowFinishButton"
					class="additional-control show-action-taken-overlay-btn"
					@click="showActionTakenOverlay">
					finish consultation
				</a>
				<a
					v-if="mustShowCancelButton"
					class="additional-control show-action-taken-overlay-btn"
					@click="showActionTakenOverlay">
					cancel consultation
				</a>
				<a
					v-if="!isCurrentUserConsultant
						&& !isConsultationFinishedOrCancelled
						&& !isOngoing"
					class="additional-control show-rescheduling-overlay-btn"
					@click="showReschedulerOverlay">
					Reschedule consultation
				</a>
			</div>
		</template>
	</Dropdown>
</template>

<style scoped lang="scss">
	.additional-controls {
		.dropdown-container{
			inset: unset;
			right: -80px;
		}
	}

	.additional-controls {
		.buttons {
			@apply flex flex-col;
		}

		.additional-control{
		@apply p-4 sm:p-2;
		&:hover {
			@apply bg-gray-400 bg-opacity-10;
		}
		}
	}
</style>

<script setup lang="ts">
import { computed } from "vue"

import { CONSULTATION_FORM_PRINT } from "$/constants/template_page_paths"

import specializePath from "$/helpers/specialize_path"

import Dropdown from "@/helpers/minor_dropdown.vue"

const props = defineProps<{
	consultationId: string,
	isCurrentUserConsultant: boolean,
	isConsultationFinishedOrCancelled: boolean,
	isHeaderControlDropdownShown: boolean,
	isOngoing: boolean
}>()

interface CustomEvents {
	(eventName: "toggleHeaderControlDropdownShown"): void
	(eventName: "showActionTakenOverlay"): void
	(eventName: "showReschedulerOverlay"): void
}
const emit = defineEmits<CustomEvents>()

const modelValue = computed({
	get(): boolean {
		return props.isHeaderControlDropdownShown
	},
	set(): void {
		emit("toggleHeaderControlDropdownShown")
	}
})

const linkToPrintableForm = specializePath(CONSULTATION_FORM_PRINT, {
	"id": props.consultationId
})

function toggleHeaderControlDropdownShown() {
	emit("toggleHeaderControlDropdownShown")
}

const mustShowFinishButton
= props.isCurrentUserConsultant && !props.isConsultationFinishedOrCancelled
const mustShowCancelButton
= !props.isCurrentUserConsultant && !props.isConsultationFinishedOrCancelled
function showActionTakenOverlay() {
	toggleHeaderControlDropdownShown()
	emit("showActionTakenOverlay")
}

function showReschedulerOverlay() {
	toggleHeaderControlDropdownShown()
	emit("showReschedulerOverlay")
}
</script>
