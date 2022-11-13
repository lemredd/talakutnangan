<template>
	<Overlay
		:is-shown="isShown"
		class="action-taken"
		@close="hideOverlay">
		<template #header>
			Reschedule this consultation?
		</template>

		<template #default>
			<p>Select the date and time to reschedule this consultation</p>
		</template>

		<template #footer>
			<button
				class="finish-btn btn btn-primary"
				@click="rescheduleConsultation">
				submit
			</button>
		</template>
	</Overlay>
</template>

<style scoped lang="scss">
</style>

<script setup lang="ts">
import Overlay from "@/helpers/overlay.vue"

type DefinedProps = {
	isShown: boolean
}
type CustomEvents = {
	(event: "hideReschedulingOverlay"): void
	(event: "rescheduleConsultation"): void
}
const props = defineProps<DefinedProps>()
const emit = defineEmits<CustomEvents>()

function hideOverlay() {
	emit("hideReschedulingOverlay")
}

function rescheduleConsultation() {
	emit("rescheduleConsultation")
}
</script>
