<template>
	<Overlay
		:is-shown="isFileRepoOverlayShown"
		class="action-taken"
		@close="hideFileRepoOverlay">
		<template #header>
			<div class="tabs">
				<button class="button-file" @click="switchTab">
					File
				</button>
				<button class="button-picture" @click="switchTab">
					Pictures
				</button>
			</div>
		</template>

		<template #default>
			<!-- show list of files -->
			<div class="sent-files overflow-y-hidden">
				<div class="file-repo flex <sm:flex-col">
					<div class="file-list flex-1">
						<li
							v-for="n in 100"
							:key="n"
							class="file">
							file.extension
						</li>
					</div>

					<div v-if="mustShowPreview" class="file-repo-preview flex-[2]">
						hello world
					</div>
				</div>
				<!-- show selected file to preview -->
			</div>
		</template>
	</Overlay>
</template>

<script setup lang="ts">
import Overlay from "@/helpers/overlay.vue"

defineProps<{
	isFileRepoOverlayShown: boolean
	mustShowPreview: boolean
}>()

interface CustomEvents {
	(eventName: "hideFileRepoOverlay"): void
	(eventName: "switchTab", event: Event): void
}
const emit = defineEmits<CustomEvents>()

function switchTab(event: Event) {
	emit("switchTab", event)
}

function hideFileRepoOverlay() {
	emit("hideFileRepoOverlay")
}
</script>
