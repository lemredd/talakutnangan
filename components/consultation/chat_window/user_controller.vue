<template>
	<div class="user-controls">
		<div v-if="mayStartConsultation" class="wide-control">
			<button
				:disabled="!willStart"
				type="button"
				class="start btn btn-primary"
				@click="startConsultation">
				Start consultation
			</button>
			<span v-if="!willStart" class="will-not-start">
				You can start the consultation once the consultant is available.
			</span>
		</div>
		<div v-if="isOngoing" class="left-controls">
			<!-- TODO(lead/button): Apply functionality -->
			<button class="material-icons" @click="saveAsPDF">
				more_horiz
			</button>
			<!-- TODO(lead/button): Apply functionality -->
			<button class="material-icons add-file-btn" @click="showFileUpload">
				attach_file
			</button>
			<FileUpload
				accept="*/*"
				:is-shown="isFileUploadFormShown"
				class="file-upload"
				@close="hideFileUpload"/>

			<button class="add-image-btn material-icons" @click="showImageUpload">
				image
			</button>
			<FileUpload
				accept="image/*"
				:is-shown="isImageUploadFormShown"
				class="image-upload"
				@close="hideImageUpload"/>
		</div>
		<div v-if="isOngoing" class="message-box">
			<input
				v-model="textInput"
				type="text"
				placeholder="Enter your message here..."
				@keyup.enter.exact="send"/>
		</div>
		<div v-if="isOngoing" class="right-controls">
			<!-- TODO(lead/button): Apply functionality -->
			<button class="material-icons">
				sentiment_satisfied
			</button>
			<button class="send-btn material-icons" @click="send">
				send
			</button>
		</div>
	</div>
</template>

<style scoped lang="scss">
@import "@styles/btn.scss";
.user-controls {
	@apply border-t p-3 flex;
}

.will-not-start{
		@apply text-sm opacity-50;
}

.message-box {
	@apply flex-1 mx-2 border-0;
	height: max-content;
	input {
		@apply bg-transparent border-b px-2;
		width: 100%;

		&:focus {
			@apply border-b-gray-500;
			outline: none;
		}
	}
}
</style>

<script setup lang="ts">
import { ref, inject, computed, ComputedRef, DeepReadonly, onMounted } from "vue"

import type { TextMessage } from "$/types/message"
import type { PageContext } from "$/types/renderer"
import type { ChatMessageRelationships } from "$/types/documents/chat_message"
import type { DeserializedConsultationResource } from "$/types/documents/consultation"
import type {
	DeserializedChatMessageActivityResource
} from "$/types/documents/chat_message_activity"

import { CHAT_MESSAGE_ACTIVITY } from "$@/constants/provided_keys"

import Fetcher from "$@/fetchers/chat_message"
import makeSwitch from "$@/helpers/make_switch"
import ChatMessageActivityFetcher from "$@/fetchers/chat_message_activity"
import ConsultationTimerManager from "$@/helpers/consultation_timer_manager"
import makeConsultationStates from "@/consultation/helpers/make_consultation_states"

import FileUpload from "@/consultation/chat_window/user_controller/file_upload.vue"

const pageContext = inject("pageContext") as PageContext<"deserialized">
const { userProfile } = pageContext.pageProps

const currentChatMessageActivity = inject(
	CHAT_MESSAGE_ACTIVITY
) as DeepReadonly<ComputedRef<DeserializedChatMessageActivityResource>>

const props = defineProps<{
	consultation: DeserializedConsultationResource<"consultant"|"consultantRole">
}>()

const textInput = ref<string>("")

const {
	"off": hideFileUpload,
	"on": showFileUpload,
	"state": isFileUploadFormShown
} = makeSwitch(false)
const {
	"off": hideImageUpload,
	"on": showImageUpload,
	"state": isImageUploadFormShown
} = makeSwitch(false)

const {
	willSoonStart,
	willStart,
	isOngoing
} = makeConsultationStates(props)

interface CustomEvents {
	(eventName: "startConsultation"): void
	(eventName: "saveAsPdf"): void
}
const emit = defineEmits<CustomEvents>()

const startConsultation = () => emit("startConsultation")
const saveAsPDF = () => emit("saveAsPdf")
const mayStartConsultation = computed<boolean>(() => {
	const shouldSoonStart = willSoonStart.value
	const shouldStart = willStart.value
	const mayStart = shouldSoonStart || shouldStart
	const canStart = userProfile.data.kind === "reachable_employee"

	return mayStart && canStart
})

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
		const seenMessageAt = new Date().toJSON()
		chatMessageActivityFetcher().update(currentChatMessageActivity.value.id, {
			"receivedMessageAt": seenMessageAt,
			seenMessageAt
		})
	})
}

onMounted(() => {
	rawFetcher = new Fetcher()
	rawChatMessageActivityFetcher = new ChatMessageActivityFetcher()
})
</script>
