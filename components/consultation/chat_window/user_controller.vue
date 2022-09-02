<template>
	<div class="user-controls">
		<div v-if="willSoonStart || willStart" class="wide-control">
			<!-- TODO(minor/button): Disable for consultation not yet scheduled -->
			<button
				:disabled="!willStart"
				class="start"
				@click="startConsultation">
				Start consultation
			</button>
		</div>
		<div v-if="isOngoing" class="left-controls">
			<!-- TODO(lead/button): Apply functionality -->
			<button class="material-icons">
				more_horiz
			</button>
			<!-- TODO(lead/button): Apply functionality -->
			<button class="material-icons">
				photo_camera
			</button>
			<!-- TODO(lead/button): Apply functionality -->
			<button class="material-icons">
				image
			</button>
		</div>
		<div v-if="isOngoing" class="message-box">
			<input type="text"/>
		</div>
		<div v-if="isOngoing" class="right-controls">
			<!-- TODO(lead/button): Apply functionality -->
			<button class="material-icons">
				sentiment_satisfied
			</button>
			<!-- TODO(lead/button): Apply functionality -->
			<button class="material-icons">
				send
			</button>
		</div>
	</div>
</template>

<style scoped lang="scss">
.user-controls {
	@apply border-t p-3 flex
}

.message-box {
	@apply flex-1 border
}
</style>

<script setup lang="ts">
import { ref, computed } from "vue"
import { DateTime, Duration } from "luxon"

import type { DeserializedConsultationResource } from "$/types/documents/consultation"

const { consultation } = defineProps<{
	consultation: DeserializedConsultationResource<"consultant"|"consultantRole">
}>()

const currentTime = ref<DateTime>(DateTime.now())

const differenceFromSchedule = computed<Duration>(() => {
	const difference = DateTime
	.fromJSDate(consultation.scheduledStartAt)
	.diff(currentTime.value)
	return difference
})
const isAfterScheduledStart = computed<boolean>(() => {
	const beyondScheduledStart = differenceFromSchedule.value.milliseconds < 0
	return beyondScheduledStart
})
const hasStarted = computed<boolean>(() => consultation.startedAt !== null)
const hasFinished = computed<boolean>(() => consultation.finishedAt !== null)
const hasDeleted = computed<boolean>(() => consultation.deletedAt !== null)

const willSoonStart = computed<boolean>(() => differenceFromSchedule.value.milliseconds > 0)
const willStart = computed<boolean>(() => {
	const mayStart = differenceFromSchedule.value.milliseconds === 0 || isAfterScheduledStart.value
	return mayStart && !hasStarted.value
})
const isOngoing = computed<boolean>(() => {
	const isInProgress = isAfterScheduledStart.value && hasStarted.value
	return isInProgress && !hasFinished.value
})
const unusedIsDone = computed<boolean>(() => {
	const isInProgress = isAfterScheduledStart.value && hasStarted.value
	return isInProgress && hasFinished.value && hasDeleted.value
})
const unusedIsCanceled = computed<boolean>(() => !isAfterScheduledStart.value && hasDeleted.value)
const unusedIsAutoTerminated = computed<boolean>(() => {
	const hasTerminated = isAfterScheduledStart.value && hasDeleted.value
	return hasTerminated && consultation.actionTaken === null
})

interface CustomEvents {
	(eventName: "startConsultation"): void
}
const emit = defineEmits<CustomEvents>()

const startConsultation = () => emit("startConsultation")
</script>
