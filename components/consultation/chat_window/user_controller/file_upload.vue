<template>
	<Overlay :is-shown="isShown" @close="emitClose">
		<template #header>
		</template>
		<template #default>
			<form @submit.prevent>
				<input
					type="hidden"
					name="data[attributes][data][subkind]"
					value="image"/>
				<input
					type="hidden"
					name="data[attributes][data][name]"
					:value="filename"/>
				<input
					type="hidden"
					name="data[attributes][kind]"
					value="file"/>
				<label class="btn" for="choose-file-btn">
					<input
						id="choose-file-btn"
						type="file"
						name="meta[fileContents]"
						accept="image/png"
						@change="extractFile"/>
					CHOOSE FILE
				</label>
				<button
					v-if="hasExtracted"
					type="button"
					@click="sendFile">
					Send file
				</button>
			</form>

			<div v-if="hasExtracted" class="preview-file mt-5">
				<div class="preview-img-container">
					<img class="preview-img max-w-30" :src="previewFile"/>
					<small class="preview-title max-w-30 text-xs">
						{{ filename }}
					</small>
				</div>
			</div>
		</template>
		<template #footer>
			<button
				class="btn back-btn"
				type="button"
				@click="emitClose">
				Back
			</button>
			<button
				:disabled="!hasExtracted"
				class="send-btn btn btn-primary"
				type="button"
				@click="sendFile">
				Send
			</button>
		</template>
	</Overlay>
</template>

<style lang="scss">
@import "@styles/btn.scss";

#choose-file-btn {
	display:none;
	appearance: none;
}
</style>

<script setup lang="ts">
import { ref, computed, inject, ComputedRef, DeepReadonly } from "vue"

import { CHAT_MESSAGE_ACTIVITY } from "$@/constants/provided_keys"

import Fetcher from "$@/fetchers/chat_message"
import Overlay from "@/helpers/overlay.vue"
import { DeserializedChatMessageActivityResource } from "$/types/documents/chat_message_activity"

defineProps<{ isShown: boolean }>()

const filename = ref<string|null>(null)
const hasExtracted = computed<boolean>(() => filename.value !== null)
const previewFile = ref<any>(null)
const fileUploadForm = ref()
const ownChatMessageActivity = inject(
	CHAT_MESSAGE_ACTIVITY
) as DeepReadonly<ComputedRef<DeserializedChatMessageActivityResource>>

interface CustomEvents {
	(event: "close"): void
}
const emit = defineEmits<CustomEvents>()
function emitClose() {
	emit("close")
}

function sendFile() {
	const fetcher = new Fetcher()
	const formData = new FormData(fileUploadForm.value as HTMLFormElement)

	fetcher.createWithFile(formData)
	.then(() => {
		emitClose()
	})
	.catch(() => {
		// Show errors
	})
}

function extractFile(event: Event) {
	const target = event.target as HTMLInputElement
	const file = target.files?.item(0)
	const rawFilename = file?.name as ""

	previewFile.value = file ? URL.createObjectURL(file) : ""
	filename.value = rawFilename
}

onMounted(() => {
	rawFetcher = new Fetcher()
})
</script>
