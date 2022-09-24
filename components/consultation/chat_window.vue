<template>
	<section class="chat-window flex flex-col right">
		<!-- TODO(others/mobile): should view once consultation is clicked in picker (by route) -->

		<div class="selected-consultation-header">
			<div class="selected-consultation-title">
				{{ consultation.reason }}
			</div>
			<div class="selected-consultation-remaining-time">
				<span v-if="remainingTime.hours > 0">{{ remainingTime.hours }}s</span>
				<span>{{ remainingTime.minutes }}m</span>
				<span v-if="remainingTime.seconds > 0">{{ remainingTime.seconds }}s</span>
			</div>
			<div class="selected-consultation-user-status row-start-2">
				<!-- TODO(lead): must base on user active status -->
				User is online
			</div>
			<div class="controls row-span-full self-center">
				<!-- TODO(lead/button): Apply functionality -->
				<button class="material-icons">
					video_camera_back
				</button>

				<!-- TODO(lead/button): Apply functionality -->
				<button class="material-icons">
					more_horiz
				</button>
			</div>
		</div>
		<div class="selected-consultation-chats px-3 py-5 flex-1 overflow-y-scroll">
			<div class="selected-consultation-new">
				<p><strong>This is a new consultation.</strong> here are some additional details</p>
				<ul class="selected-consultation-additional-details bg-gray-300 p-5">
					<li>Ticket: {{ consultationID }}</li>
					<li>Status: {{ consultationStatus }}</li>

					<!-- TODO(lead/button): Apply functionality -->
					<li><a href="#">View printable form (PDF)</a></li>
				</ul>
			</div>

			<div
				v-for="message in props.chatMessages.data"
				:key="message.id"
				class="chat-entry">
				<ChatMessageItem :chat-message="message"/>
			</div>
		</div>
		<UserController :consultation="consultation" @start-consultation="startConsultation"/>
	</section>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue"

import type { FullTime } from "$@/types/independent"
import type { DeserializedChatMessageListDocument } from "$/types/documents/chat_message"
import type {
	ConsultationAttributes,
	DeserializedConsultationResource
} from "$/types/documents/consultation"

import ConsultationFetcher from "$@/fetchers/consultation"
import ConsultationTimerManager from "$@/helpers/consultation_timer_manager"
import convertMillisecondsToFullTimeObject
	from "$@/helpers/convert_milliseconds_to_full_time_object"

import UserController from "@/consultation/chat_window/user_controller.vue"
import ChatMessageItem from "@/consultation/chat_window/chat_message_item.vue"

const props = defineProps<{
	consultation: DeserializedConsultationResource<"consultant"|"consultantRole">
	chatMessages: DeserializedChatMessageListDocument<"user">
}>()

const remainingMilliseconds = ref<number>(0)
const remainingTime = computed<FullTime>(
	() => convertMillisecondsToFullTimeObject(remainingMilliseconds.value)
)
const consultation = computed<DeserializedConsultationResource<"consultant"|"consultantRole">>(
	() => props.consultation
)
const consultationID = computed<string>(() => consultation.value.id)
const consultationStatus = computed<string>(() => consultation.value.status)

interface CustomEvents {
	(eventName: "updatedConsultationAttributes", data: ConsultationAttributes<"deserialized">): void
}
const emit = defineEmits<CustomEvents>()

function restartRemainingTime(): void {
	remainingMilliseconds.value = ConsultationTimerManager.MAX_EXPIRATION_TIME
}

function changeTime(
	unusedResource: DeserializedConsultationResource,
	remainingMillisecondduration: number
): void {
	remainingMilliseconds.value = remainingMillisecondduration
}

function finishConsultation(): void {
	const { startedAt } = consultation.value

	if (startedAt instanceof Date) {
		const newConsultationData: ConsultationAttributes<"serialized"> = {
			"actionTaken": null,
			"deletedAt": consultation.value.deletedAt?.toISOString() ?? null,
			"finishedAt": new Date().toISOString(),
			"reason": consultation.value.reason,
			"scheduledStartAt": consultation.value.scheduledStartAt.toISOString(),
			"startedAt": startedAt.toISOString()
		}

		const deserializedConsultationData: ConsultationAttributes<"deserialized"> = {
			"actionTaken": consultation.value.actionTaken,
			"deletedAt": consultation.value.deletedAt ?? null,
			"finishedAt": new Date(newConsultationData.finishedAt as string),
			"reason": consultation.value.reason,
			"scheduledStartAt": consultation.value.scheduledStartAt,
			startedAt
		}

		const expectedDeserializedConsultationResource: DeserializedConsultationResource<
			"consultant"|"consultantRole"
		> = {
			...consultation.value,
			...deserializedConsultationData
		}

		ConsultationTimerManager.unlistenConsultationTimeEvent(
			expectedDeserializedConsultationResource,
			"finish",
			finishConsultation
		)

		new ConsultationFetcher().update(consultationID.value, newConsultationData)
		.then(() => {
			remainingMilliseconds.value = 0
			emit("updatedConsultationAttributes", deserializedConsultationData)
		})
	}
}

function registerListeners(resource: DeserializedConsultationResource): void {
	ConsultationTimerManager.listenConsultationTimeEvent(resource, "finish", finishConsultation)
	ConsultationTimerManager.listenConsultationTimeEvent(
		resource,
		"restartTime",
		restartRemainingTime
	)
	ConsultationTimerManager.listenConsultationTimeEvent(resource, "consumedTime", changeTime)
}

function startConsultation() {
	const newConsultationData: ConsultationAttributes<"serialized"> = {
		"actionTaken": null,
		"deletedAt": consultation.value.deletedAt?.toISOString() ?? null,
		"finishedAt": null,
		"reason": consultation.value.reason,
		"scheduledStartAt": consultation.value.scheduledStartAt.toISOString(),
		"startedAt": new Date().toISOString()
	}

	new ConsultationFetcher().update(consultationID.value, newConsultationData).then(() => {
		const deserializedConsultationData: ConsultationAttributes<"deserialized"> = {
			"actionTaken": consultation.value.actionTaken,
			"deletedAt": consultation.value.deletedAt ?? null,
			"finishedAt": consultation.value.finishedAt,
			"reason": consultation.value.reason,
			"scheduledStartAt": consultation.value.scheduledStartAt,
			"startedAt": new Date(newConsultationData.startedAt as string)
		}

		const expectedDeserializedConsultationResource: DeserializedConsultationResource<
			"consultant"|"consultantRole"
		> = {
			...consultation.value,
			...deserializedConsultationData
		}

		registerListeners(expectedDeserializedConsultationResource)

		remainingMilliseconds.value = ConsultationTimerManager.MAX_EXPIRATION_TIME
		emit("updatedConsultationAttributes", deserializedConsultationData)
	})
}

const startWatcher = watch(consultation, (newConsultation, oldConsultation) => {
	if (oldConsultation.startedAt === null && newConsultation.startedAt instanceof Date) {
		registerListeners(newConsultation)

		startWatcher()
	}
}, { "deep": true })

onMounted(() => {
	if (props.consultation.startedAt instanceof Date && props.consultation.finishedAt === null) {
		registerListeners(props.consultation)
		ConsultationTimerManager.restartTimerFor(props.consultation)
	}
})
</script>
