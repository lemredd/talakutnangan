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
					<ul v-if="!mustShowPreview" class="file-list general-files">
						<li
							v-for="file in generalFiles.data"
							:key="file.id"
							class="file-item">
							{{ file.data.name }}

							<a
								:href="file.attachedChatFile?.data.fileContents"
								target="_blank"
								class="material-icons download-btn">download</a>
						</li>
					</ul>
					<ul v-else class="file-list image-files">
						<li
							v-for="file in imageFiles.data"
							:key="file.id"
							class="file-item"
							@click="previewImageFile(file)">
							{{ file.data.name }}
						</li>
					</ul>

					<!--  -->
					<div v-if="mustShowPreview" class="file-repo-preview">
						<img class="image-to-preview" :src="imageToPreview"/>
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

		min-width: 40%;
		&.image-files {
			@screen md {
				max-width: 150px;
			}
		}

		.file-item {
			@apply flex items-center justify-between;

			cursor: pointer;
			overflow-x: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}

	.file-repo-preview{
		@apply my-auto flex justify-center items-center;

		.image-to-preview {
			max-width: 100%;
			max-height: min-content;
			height: inherit;
			width: inherit;
			@apply object-cover;
		}
	}
</style>

<script setup lang="ts">
import { ref } from "vue"

import type {
	DeserializedChatMessageListDocument,
	DeserializedChatMessageResource
} from "$/types/documents/chat_message"

import Overlay from "@/helpers/overlay.vue"

defineProps<{
	generalFiles: DeserializedChatMessageListDocument
	imageFiles: DeserializedChatMessageListDocument
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

const imageToPreview = ref("")
function previewImageFile(file: DeserializedChatMessageResource) {
	const { fileContents } = file.attachedChatFile?.data as { "fileContents": string }
	imageToPreview.value = fileContents
}
</script>
