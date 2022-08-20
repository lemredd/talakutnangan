<template>
	<div class="user-controls">
		<div v-if="willStart" class="wide-control">
			<!-- TODO(minor/button): Disable for consultation not yet scheduled -->
			<button class="start" @click="startConsultation">
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
import { computed } from "vue"
import type { Status } from "$/types/database"

const { status } = defineProps<{ status: Status }>()

const willStart = computed<boolean>(() => status === "will_start")
const isOngoing = computed<boolean>(() => status === "ongoing")

interface CustomEvents {
	(eventName: "startConsultation"): void
}
const emit = defineEmits<CustomEvents>()

const startConsultation = () => emit("startConsultation")
</script>
