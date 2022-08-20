<template>
	<div class="user-controls">
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

const isOngoing = computed<boolean>(() => status === "ongoing")
</script>
