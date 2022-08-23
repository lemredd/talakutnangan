<template>
	<section class="selected-consultation flex flex-col right">
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
				v-for="message in consultationMessages.data"
				:key="message.id"
				class="chat-entry">
				<!-- TODO(others): properly place chat entries -->
				{{ JSON.stringify(message.data) }}
			</div>
		</div>
		<UserController :status="consultationStatus" @start-consultation="startConsultation"/>
	</section>
</template>

<script setup lang="ts">
import { computed } from "vue"
import type { DeserializedChatMessageListDocument } from "$/types/documents/chat_message"
import type {
	ConsultationAttributes,
	DeserializedConsultationResource,
	ConsultationRelationshipNames
} from "$/types/documents/consultation"

import ConsultationFetcher from "$@/fetchers/consultation"
import UserController from "@/consultation/chat_window/user_controller.vue"

const { consultation } = defineProps<{
	consultation: DeserializedConsultationResource<ConsultationRelationshipNames>
}>()
const consultationID = computed<string>(() => consultation.id)
const consultationStatus = computed<string>(() => consultation.status)
const consultationMessages = computed<DeserializedChatMessageListDocument>(
	() => consultation.chatMessages as DeserializedChatMessageListDocument
)

interface CustomEvents {
	(eventName: "updatedConsultationAttributes", data: ConsultationAttributes): void
}
const emit = defineEmits<CustomEvents>()

function startConsultation() {
	const newConsultationData: ConsultationAttributes = {
		"actionTaken": consultation.actionTaken,
		"endDatetime": consultation.endDatetime,
		"reason": consultation.reason,
		"scheduledStartDatetime": consultation.scheduledStartDatetime,
		"status": "ongoing"
	}
	new ConsultationFetcher().update(consultationID.value, newConsultationData).then(() => {
		// TODO: Start the timer
		emit("updatedConsultationAttributes", newConsultationData)
	})
}
</script>
