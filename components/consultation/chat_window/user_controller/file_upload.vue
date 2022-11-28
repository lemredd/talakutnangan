<template>
	<Overlay
		:is-shown="isShown"
		:disable-close-btn="isSending"
		@close="emitClose">
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
						@input="extractFile"/>
					CHOOSE {{ subKind }}
				</label>
				<small class="file-size-info">The max {{ subKind }} size limit is 20MB.</small>
			</form>

			<Suspensible :is-loaded="hasAttachedFile">
				<div v-if="hasExtracted" class="preview-file">
					<div v-if="isAcceptingImage" class="preview-img-container">
						<div class="removable-image relative">
							<span
								class="material-icons close"
								@click="removeFile">
								close
							</span>
							<img class="preview-img" :src="previewFile"/>
							<small class="preview-title">
								{{ filename }}
							</small>
						</div>
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
						<button
							:disabled="isSending"
							type="button"
							class="remove-file-btn material-icons cursor-pointer"
							@click="removeFile">
							close
						</button>
					</div>
				</div>
			</Suspensible>
		</template>

		<template #footer>
			<Suspensible :is-loaded="!isSending" class="suspended-btns">
				<div class="loaded-btns">
					<button
						:disabled="isSending"
						class="btn back-btn"
						type="button"
						@click="emitClose">
						Back
					</button>
					<button
						:disabled="isSendBtnDisabled"
						class="send-btn btn btn-primary"
						type="button"
						@click="sendFile">
						Send
					</button>
				</div>
			</Suspensible>
		</template>
	</Overlay>
</template>

<style scoped lang="scss">
@import "@styles/btn.scss";

	#choose-file-btn {
		display:none;
		appearance: none;
	}

	.file-size-info {
		@apply ml-2 text-dark-100;
	}

	.preview-file {
		@apply mt-5;
	}

	.preview-img {
		@apply py-5 max-w-3;
		max-width:100%;
		max-height:100%;
	}

	.preview-title {
		@apply max-w-30 text-xs;
	}

	.preview-file-container {
		@apply bg-true-gray-200 flex items-center px-3 py-2;

		.preview-file-title {
			@apply flex-1 text-xs;
		}
	}

	.close {
		@apply p-2 bg-black bg-opacity-60 text-white absolute right-0 top-5;
	}

	.selected-file {
		@apply ml-2;
		@apply text-gray-700;
	}

	.suspended-btns, .loaded-btns {
		width: 100%;
	}
	.loaded-btns {
		@apply flex justify-between;
	}
</style>

<script setup lang="ts">
import {
	ref,
	inject,
	nextTick,
	computed,
	ComputedRef,
	DeepReadonly
} from "vue"

import { CHAT_MESSAGE_ACTIVITY } from "$@/constants/provided_keys"

import { MAXIMUM_FILE_SIZE } from "$/constants/measurement"

import Fetcher from "$@/fetchers/chat_message"
import extractAllErrorDetails from "$@/helpers/extract_all_error_details"

import Overlay from "@/helpers/overlay.vue"
import Suspensible from "@/helpers/suspensible.vue"
import ReceivedErrors from "@/helpers/message_handlers/received_errors.vue"
import { DeserializedChatMessageActivityResource } from "$/types/documents/chat_message_activity"
import { MILLISECOND_IN_A_SECOND } from "$/constants/numerical"

const props = defineProps<{
	accept: "image/*" | "*/*"
	isShown: boolean
}>()
interface CustomEvents {
	(event: "close"): void
}
const emit = defineEmits<CustomEvents>()

const isAcceptingImage = props.accept.includes("image/")
const isAcceptingFile = props.accept.includes("*/")
const subKind = isAcceptingImage ? "image" : "file"

const hasAttachedFile = ref(true)
const filename = ref<string|null>(null)
const hasExtracted = computed<boolean>(() => filename.value !== null)
const previewFile = ref<any>(null)
const fileSize = ref<number|null>(null)
const isFileSizeGreaterThanLimit = computed(() => {
	const castedFileSize = fileSize.value as number
	return castedFileSize > MAXIMUM_FILE_SIZE
})
const fileUploadForm = ref()
const receivedErrors = ref<string[]>([])
const ownChatMessageActivity = inject(
	CHAT_MESSAGE_ACTIVITY
) as DeepReadonly<ComputedRef<DeserializedChatMessageActivityResource>>

function removeFile() {
	filename.value = null
	previewFile.value = null
	fileSize.value = null
	receivedErrors.value = []
}

async function extractFile(event: Event) {
	hasAttachedFile.value = false
	removeFile()

	receivedErrors.value = []
	const target = event.target as HTMLInputElement
	const file = target.files?.item(0)
	const rawFilename = file?.name as ""

	fileSize.value = file?.size as number|null
	if (isFileSizeGreaterThanLimit.value) receivedErrors.value.push("Maximum file size is 20mb")

	previewFile.value = file ? URL.createObjectURL(file) : ""
	filename.value = rawFilename
	await nextTick()

	setTimeout(() => {
		hasAttachedFile.value = true
	}, MILLISECOND_IN_A_SECOND)
}

function emitClose() {
	removeFile()
	emit("close")
}

const isSending = ref(false)
const isSendBtnDisabled = computed(
	() => !hasExtracted.value
	|| isFileSizeGreaterThanLimit.value
	|| isSending.value
	|| !hasAttachedFile.value
)
async function sendFile() {
	isSending.value = true

	const fetcher = new Fetcher()
	const formData = new FormData(fileUploadForm.value as HTMLFormElement)

	await fetcher.createWithFile(formData)
	.then(() => {
		emitClose()
	})
	.catch(response => extractAllErrorDetails(response, receivedErrors))

	isSending.value = false
}
</script>
