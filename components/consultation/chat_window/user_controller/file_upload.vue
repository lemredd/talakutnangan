<template>
	<Overlay :is-shown="isShown" @close="emitClose">
		<template #header>
		</template>
		<template #default>
			<ReceivedErrors v-if="receivedErrors.length" :received-errors="receivedErrors"/>
			<form ref="fileUploadForm" @submit.prevent>
				<input
					type="hidden"
					name="data[type]"
					value="chat_message"/>
				<input
					type="hidden"
					name="data[attributes][data][subkind]"
					class="sub-kind"
					:value="subKind"/>
				<input
					type="hidden"
					name="data[relationships][chatMessageActivity][data][id]"
					:value="ownChatMessageActivity.id"/>
				<input
					type="hidden"
					name="data[relationships][chatMessageActivity][data][type]"
					:value="ownChatMessageActivity.type"/>
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
						:accept="accept"
						@change="extractFile"/>
					CHOOSE FILE
				</label>
			</form>

			<div v-if="hasExtracted" class="preview-file">
				<div v-if="isAcceptingImage" class="preview-img-container">
					<img class="preview-img" :src="previewFile"/>
					<small class="preview-title">
						{{ filename }}
					</small>
				</div>
				<div
					v-if="isAcceptingFile"
					class="preview-file-container">
					<span class="material-icons mr-2">
						attachment
					</span>
					<small class="preview-file-title">
						{{ filename }}
					</small>
					<span class="remove-file-btn material-icons cursor-pointer">
						close
					</span>
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

<style scoped lang="scss">
@import "@styles/btn.scss";

#choose-file-btn {
	display:none;
	appearance: none;
}

.preview-file{
	@apply mt-5;
}

.preview-img{
	@apply max-w-3;
}

.preview-title{
	@apply max-w-30 text-xs;
}

.preview-file-container {
	@apply bg-true-gray-200 flex items-center px-3 py-2;
}

.preview-file-title{
	@apply flex-1 text-xs;
}

</style>

<script setup lang="ts">
import { ref, computed, inject, ComputedRef, DeepReadonly } from "vue"

import { CHAT_MESSAGE_ACTIVITY } from "$@/constants/provided_keys"
import type { UnitError } from "$/types/server"

import Fetcher from "$@/fetchers/chat_message"
import Overlay from "@/helpers/overlay.vue"
import ReceivedErrors from "@/helpers/received_errors.vue"
import { DeserializedChatMessageActivityResource } from "$/types/documents/chat_message_activity"

const props = defineProps<{
	accept: "image/*" | "*/*"
	isShown: boolean
}>()

const isAcceptingImage = props.accept.includes("image/")
const isAcceptingFile = props.accept.includes("*/")
const subKind = isAcceptingImage ? "image" : "file"

const filename = ref<string|null>(null)
const hasExtracted = computed<boolean>(() => filename.value !== null)
const previewFile = ref<any>(null)
const fileUploadForm = ref()
const ownChatMessageActivity = inject(
	CHAT_MESSAGE_ACTIVITY
) as DeepReadonly<ComputedRef<DeserializedChatMessageActivityResource>>

const receivedErrors = ref<string[]>([])

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

	.catch(({ body }) => {
		if (body) {
			const { errors } = body
			receivedErrors.value = errors.map((error: UnitError) => {
				const readableDetail = error.detail

				return readableDetail
			})
		} else {
			receivedErrors.value = [ "an error occured" ]
		}
	})
}

function extractFile(event: Event) {
	const target = event.target as HTMLInputElement
	const file = target.files?.item(0)
	const rawFilename = file?.name as ""

	previewFile.value = file ? URL.createObjectURL(file) : ""
	filename.value = rawFilename
}
</script>
