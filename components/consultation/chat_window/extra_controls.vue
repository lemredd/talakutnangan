<template>
	<Dropdown
		v-model="modelValue"
		class="additional-controls">
		<template #dropdown-contents>
			<div class="buttons">
				<a
					:href="linkToPrintableForm"
					class="additional-control view-printable-form-link">
					View consultation form
				</a>
				<a
					v-if="!isConsultationFinishedOrCancelled"
					class="additional-control show-action-taken-overlay-btn"
					@click="showActionTakenOverlay">
					{{ finishOrCancel }} consultation
				</a>
				<a
					v-if="!isCurrentUserConsultant"
					class="additional-control show-rescheduling-overlay-btn"
					@click="showActionTakenOverlay">
					{{ finishOrCancel }} consultation
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
		@apply p-4 sm:p-2 hover:bg-light-600;
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
	isHeaderControlDropdownShown: boolean,
	isCurrentUserConsultant: boolean,
	isConsultationFinishedOrCancelled: boolean
}>()

interface CustomEvents {
	(eventName: "toggleHeaderControlDropdownShown"): void
	(eventName: "showActionTakenOverlay"): void
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

const { isCurrentUserConsultant } = props
const finishOrCancel = isCurrentUserConsultant ? "Finish" : "Cancel"
function showActionTakenOverlay() {
	toggleHeaderControlDropdownShown()
	emit("showActionTakenOverlay")
}
</script>
