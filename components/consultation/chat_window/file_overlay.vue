<template>
	<Overlay
		:is-shown="isFileRepoOverlayShown"
		class="action-taken"
		@close="hideFileRepoOverlay">
		<template #header>
			<div class="Tab">
				<button class="file-tab" @click="switchTab">
					File
				</button>
				<button class="picture-tab" @click="switchTab">
					Pictures
				</button>
			</div>
		</template>

		<template #default>
			<!-- show list of files -->
			<div class="sent-files">
				<div class="file-repo">
					<div class="file-list">
						<li
							v-for="n in 100"
							:key="n"
							class="file">
							file.extension
						</li>
					</div>

					<!--  -->
					<div v-if="mustShowPreview" class="file-repo-preview flex-[2]">
						hello world
					</div>
				</div>
				<!-- show selected file to preview -->
			</div>
		</template>
	</Overlay>
</template>

<style scoped lang="scss">
	.file-tab{
			@apply ml-40px;
	}
	.picture-tab{
			@apply ml-80px;
	}
	@screen sm {
					margin:auto 0;
					.file-tab{
						@apply ml-80px;
				}
					.picture-tab{
						@apply ml-80px;
				}
			}
	.sent-files{
		@apply overflow-y-hidden;
	}

	.file-repo{
		@apply flex <md:flex-col;
	}
	.file-list{
		@apply overflow-y-scroll;

		max-height: 20vh;
		@screen md {
			max-width: 130px;
			@apply flex-1 max-h-80;
		}
	}

	.file-repo-preview{
		@apply min-w-max;

		}


</style>

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
