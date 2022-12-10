<template>
	<div class="user-controls">
		<div v-if="mayStartConsultation" class="wide-control">
			<button
				:disabled="!willStart"
				type="button"
				class="start btn btn-primary"
				@click="startConsultation">
				{{ startBtnText }}
			</button>
			<span v-if="!willStart" class="start-btn-message">
				You can only start this consultation on its scheduled time.
			</span>
			<span v-if="mayForceStart" class="start-btn-message">
				This consultation is urgent.
			</span>
		</div>
		<div v-if="isOngoing" class="left-controls">
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
				:disabled="isSending"
				type="text"
				placeholder="Enter your message here..."
				@keyup.enter.exact="send"/>
		</div>
		<div v-if="isOngoing" class="right-controls">
			<button
				:disabled="isSending"
				class="send-btn material-icons"
				@click="send">
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

	.start-btn-message{
			@apply text-sm opacity-50 ml-2;
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

	.send-btn:disabled {
		@apply opacity-20;
		cursor: pointer;
	}
</style>

<script setup lang="ts">
import { ref, inject, computed, ComputedRef, DeepReadonly } from "vue"

import type { TextMessage } from "$/types/message"
import type { PageContext } from "$/types/renderer"
import type { ChatMessageRelationships } from "$/types/documents/chat_message"
import type { DeserializedConsultationResource } from "$/types/documents/consultation"
import type {
	DeserializedChatMessageActivityResource
} from "$/types/documents/chat_message_activity"

import { CHAT_MESSAGE_ACTIVITY } from "$@/constants/provided_keys"
import { CUSTOM_MILLISECONDS_IF_URGENT } from "$/constants/numerical"

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
	consultation: DeserializedConsultationResource<"consultor"|"consultorRole">
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
	(eventName: "startConsultation", forceStart: boolean): void
}
const emit = defineEmits<CustomEvents>()

const mayForceStart = computed(() => {
	const doesMatchCustomMillisecondsIfUrgent
	= props.consultation.scheduledStartAt.getMilliseconds() === CUSTOM_MILLISECONDS_IF_URGENT

	return doesMatchCustomMillisecondsIfUrgent
})
const startBtnText = computed(() => {
	let text = "Start Consultation"
	if (mayForceStart.value) text = "Force Start"

	return text
})
function startConsultation() {
	emit("startConsultation", mayForceStart.value)
}
const mayStartConsultation = computed<boolean>(() => {
	const shouldSoonStart = willSoonStart.value
	const shouldStart = willStart.value
	const mayStart = shouldSoonStart || shouldStart
	const canStart = userProfile.data.kind === "reachable_employee"

	return mayStart && canStart
})

const fetcher: Fetcher = new Fetcher()
const chatMessageActivityFetcher = new ChatMessageActivityFetcher()

const isSending = ref(false)
async function send() {
	isSending.value = true
	if (textInput.value === "") {
		isSending.value = false
		return
	}

	await fetcher.create({
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
		chatMessageActivityFetcher.update(currentChatMessageActivity.value.id, {
			"receivedMessageAt": seenMessageAt,
			seenMessageAt
		})
	})

	isSending.value = false
}
</script>
