<template>
	<Dropdown
		v-model="modelValue"
		class="additional-controls">
		<template #dropdown-contents>
			<div class="buttons">
				<a
					href="#"
					class="additional-control view-printable-form-btn">
					View consultation form
				</a>
				<a
					v-if="isCurrentUserConsultant"
					href="#"
					class="additional-control show-action-taken-overlay-btn"
					@click="showActionTakenOverlay">Finish consultation</a>
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

import Dropdown from "@/helpers/minor_dropdown.vue"

const props = defineProps<{
	isHeaderControlDropdownShown: boolean,
	isCurrentUserConsultant: boolean
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

function toggleHeaderControlDropdownShown() {
	emit("toggleHeaderControlDropdownShown")
}
function showActionTakenOverlay() {
	toggleHeaderControlDropdownShown()
	emit("showActionTakenOverlay")
}

</script>
