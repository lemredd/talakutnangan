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
import { ref, inject, ComputedRef, DeepReadonly, computed, onMounted } from "vue"

import type { TextMessage } from "$/types/message"
import type { ChatMessageRelationships } from "$/types/documents/chat_message"
import type { DeserializedConsultationResource } from "$/types/documents/consultation"
import type {
	DeserializedChatMessageActivityResource
} from "$/types/documents/chat_message_activity"

import { CHAT_MESSAGE_ACTIVITY } from "$@/constants/provided_keys"

import Fetcher from "$@/fetchers/chat_message"
import ChatMessageActivityFetcher from "$@/fetchers/chat_message_activity"
import convertTimeToMilliseconds from "$/time/convert_time_to_milliseconds"
import ConsultationTimerManager from "$@/helpers/consultation_timer_manager"
import calculateMillisecondDifference from "$@/helpers/calculate_millisecond_difference"

import FileUpload from "@/consultation/chat_window/user_controller/file_upload.vue"

const currentChatMessageActivity = inject(
	CHAT_MESSAGE_ACTIVITY
) as DeepReadonly<ComputedRef<DeserializedChatMessageActivityResource>>

const props = defineProps<{
	consultation: DeserializedConsultationResource<"consultant"|"consultantRole">
}>()

const currentTime = ref<Date>(new Date())
const textInput = ref<string>("")
const isFileUploadFormShown = ref<boolean>(false)

const differenceFromSchedule = computed<number>(() => calculateMillisecondDifference(
	props.consultation.scheduledStartAt,
	currentTime.value
))
const isAfterScheduledStart = computed<boolean>(() => differenceFromSchedule.value < 0)
const hasStarted = computed<boolean>(() => props.consultation.startedAt !== null)
const hasFinished = computed<boolean>(() => props.consultation.finishedAt !== null)
const hasDeleted = computed<boolean>(() => props.consultation.deletedAt !== null)

const willSoonStart = computed<boolean>(() => differenceFromSchedule.value > 0)
const willStart = computed<boolean>(() => {
	const mayStart = differenceFromSchedule.value === 0 || isAfterScheduledStart.value
	return mayStart && !hasStarted.value
})
const isOngoing = computed<boolean>(() => {
	const isInProgress = isAfterScheduledStart.value && hasStarted.value
	return isInProgress && !hasFinished.value
})
const unusedIsDone = computed<boolean>(() => {
	const isInProgress = isAfterScheduledStart.value && hasStarted.value
	return isInProgress && hasFinished.value && hasDeleted.value
})
const unusedIsCanceled = computed<boolean>(() => !isAfterScheduledStart.value && hasDeleted.value)
const unusedIsAutoTerminated = computed<boolean>(() => {
	const hasTerminated = isAfterScheduledStart.value && hasDeleted.value
	return hasTerminated && props.consultation.actionTaken === null
})

setInterval(() => {
	currentTime.value = new Date()
}, convertTimeToMilliseconds("00:00:01"))

interface CustomEvents {
	(eventName: "startConsultation"): void
}
const emit = defineEmits<CustomEvents>()

const startConsultation = () => emit("startConsultation")

let rawFetcher: Fetcher|null = null
let rawChatMessageActivityFetcher: ChatMessageActivityFetcher|null = null

function fetcher(): Fetcher {
	if (rawFetcher) return rawFetcher

	throw new Error("Messages cannot be sent to server yet.")
}

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
		"relationships": {
			"chatMessageActivity": {
				"data": {
					"id": currentChatMessageActivity.value.id,
					"type": "chat_message_activity"
				}
			}
		}
	} as ChatMessageRelationships).then(() => {
		textInput.value = ""
		ConsultationTimerManager.restartTimerFor(props.consultation)
		chatMessageActivityFetcher().update(currentChatMessageActivity.value.id, {
			"receivedMessageAt": new Date(currentChatMessageActivity.value.receivedMessageAt),
			"sentMessageAt": new Date()
		})
	})
}

onMounted(() => {
	rawFetcher = new Fetcher()
	rawChatMessageActivityFetcher = new ChatMessageActivityFetcher()
})
</script>
