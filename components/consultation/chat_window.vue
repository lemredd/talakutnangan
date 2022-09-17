<template>
	<section class="chat-window flex flex-col right">
		<!-- TODO(others/mobile): should view once consultation is clicked in picker (by route) -->

		<div class="selected-consultation-header">
			<div class="selected-consultation-title">
				{{ consultation.reason }}
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
import { ref, computed } from "vue"
import type { DeserializedChatMessageListDocument } from "$/types/documents/chat_message"
import type {
	ConsultationAttributes,
	DeserializedConsultationResource
} from "$/types/documents/consultation"

import ConsultationFetcher from "$@/fetchers/consultation"
import convertTimeToMinutes from "$/object/convert_time_to_minutes"

import UserController from "@/consultation/chat_window/user_controller.vue"
import ChatMessageItem from "@/consultation/chat_window/chat_message_item.vue"

type Timer = ReturnType<typeof setInterval>

const props = defineProps<{
	consultation: DeserializedConsultationResource<"consultant"|"consultantRole">
	chatMessages: DeserializedChatMessageListDocument<"user">
}>()

const consultationID = computed<string>(() => props.consultation.id)
const consultationStatus = computed<string>(() => props.consultation.status)
const SECONDS_PER_MINUTE = 60
const remainingSecondsBeforeInactivity = ref<number>(
	convertTimeToMinutes("00:05") * SECONDS_PER_MINUTE
)
const interval = ref<Timer|null>(null)

interface CustomEvents {
	(eventName: "updatedConsultationAttributes", data: ConsultationAttributes<"deserialized">): void
}
const emit = defineEmits<CustomEvents>()

function finishConsultation() {
	const { consultation } = props
	const { startedAt } = consultation

	if (startedAt instanceof Date) {
		console.log("after update but bfore reupdate", props, startedAt, "\n\n\n\n")
		const newConsultationData: ConsultationAttributes<"serialized"> = {
			"actionTaken": null,
			"deletedAt": consultation.deletedAt?.toISOString() ?? null,
			"finishedAt": new Date().toISOString(),
			"reason": consultation.reason,
			"scheduledStartAt": consultation.scheduledStartAt.toISOString(),
			"startedAt": startedAt.toISOString()
		}
		clearInterval(interval.value as Timer)
		interval.value = null
		new ConsultationFetcher().update(consultationID.value, newConsultationData).then(() => {
			const deserializedConsultationData: ConsultationAttributes<"deserialized"> = {
				"actionTaken": consultation.actionTaken,
				"deletedAt": consultation.deletedAt ?? null,
				"finishedAt": consultation.finishedAt,
				"reason": consultation.reason,
				"scheduledStartAt": consultation.scheduledStartAt,
				startedAt
			}
			emit("updatedConsultationAttributes", deserializedConsultationData)
		})
	}
}

function startConsultation() {
	const { consultation } = props

	const newConsultationData: ConsultationAttributes<"serialized"> = {
		"actionTaken": null,
		"deletedAt": consultation.deletedAt?.toISOString() ?? null,
		"finishedAt": null,
		"reason": consultation.reason,
		"scheduledStartAt": consultation.scheduledStartAt.toISOString(),
		"startedAt": new Date().toISOString()
	}

	new ConsultationFetcher().update(consultationID.value, newConsultationData).then(() => {
		const deserializedConsultationData: ConsultationAttributes<"deserialized"> = {
			"actionTaken": consultation.actionTaken,
			"deletedAt": consultation.deletedAt ?? null,
			"finishedAt": consultation.finishedAt,
			"reason": consultation.reason,
			"scheduledStartAt": consultation.scheduledStartAt,
			"startedAt": new Date(newConsultationData.startedAt as string)
		}

		interval.value = setInterval(() => {
			remainingSecondsBeforeInactivity.value--
			if (remainingSecondsBeforeInactivity.value === 0) {
				finishConsultation()
			}
		}, 1000)

		emit("updatedConsultationAttributes", deserializedConsultationData)
	})
}
</script>
