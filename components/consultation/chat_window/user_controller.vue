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
			<button class="material-icons" @click="showFileUpload">
				image
			</button>
			<FileUpload :is-shown="isFileUploadFormShown" @close="hideFileUpload"/>
		</div>
		<div v-if="isOngoing" class="message-box">
			<input
				v-model="textInput"
				type="text"
				@keyup.enter.exact="send"/>
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
import { ref, inject, ComputedRef, DeepReadonly, onMounted } from "vue"

import type { TextMessage } from "$/types/message"
import type { ChatMessageRelationships } from "$/types/documents/chat_message"
import type { DeserializedConsultationResource } from "$/types/documents/consultation"
import type {
	DeserializedChatMessageActivityResource
} from "$/types/documents/chat_message_activity"

import { CHAT_MESSAGE_ACTIVITY } from "$@/constants/provided_keys"

import Fetcher from "$@/fetchers/chat_message"
import ChatMessageActivityFetcher from "$@/fetchers/chat_message_activity"
import ConsultationTimerManager from "$@/helpers/consultation_timer_manager"
import makeConsultationStates from "@/consultation/helpers/make_consultation_states"

import FileUpload from "@/consultation/chat_window/user_controller/file_upload.vue"

const currentChatMessageActivity = inject(
	CHAT_MESSAGE_ACTIVITY
) as DeepReadonly<ComputedRef<DeserializedChatMessageActivityResource>>

const props = defineProps<{
	consultation: DeserializedConsultationResource<"consultant"|"consultantRole">
}>()

const textInput = ref<string>("")
const isFileUploadFormShown = ref<boolean>(false)

const {
	willSoonStart,
	willStart,
	isOngoing
} = makeConsultationStates(props)

interface CustomEvents {
	(eventName: "startConsultation"): void
}
const emit = defineEmits<CustomEvents>()

const startConsultation = () => emit("startConsultation")

let rawFetcher: Fetcher|null = null
function fetcher(): Fetcher {
	if (rawFetcher) return rawFetcher

	throw new Error("Messages cannot be sent to server yet.")
}

let rawChatMessageActivityFetcher: ChatMessageActivityFetcher|null = null
function chatMessageActivityFetcher(): ChatMessageActivityFetcher {
	if (rawChatMessageActivityFetcher) return rawChatMessageActivityFetcher

	throw new Error("Chat message activities cannot be processed yet.")
}

function showFileUpload() {
	isFileUploadFormShown.value = true
}
function hideFileUpload() {
	isFileUploadFormShown.value = false
}

function send(): void {
	fetcher().create({
		"data": {
			"value": textInput.value
		},
		"kind": "text"
	} as TextMessage, {
		"extraDataFields": {
			"relationships": {
				"chatMessageActivity": {
					"data": {
						"id": currentChatMessageActivity.value.id,
						"type": "chat_message_activity"
					}
				}
			}
		} as ChatMessageRelationships
	}).then(() => {
		textInput.value = ""
		ConsultationTimerManager.restartTimerFor(props.consultation)
		chatMessageActivityFetcher().update(currentChatMessageActivity.value.id, {
			"receivedMessageAt": currentChatMessageActivity.value.receivedMessageAt.toString(),
			"seenMessageAt": new Date().toJSON()
		})
	})
}

onMounted(() => {
	rawFetcher = new Fetcher()
	rawChatMessageActivityFetcher = new ChatMessageActivityFetcher()
})
</script>
