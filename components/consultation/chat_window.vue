<template>
	<section class="selected-consultation flex flex-col right">
		<!-- TODO(others/mobile): should view once consultation is clicked in picker (by route) -->

		<div class="selected-consultation-header">
			<div class="selected-consultation-title">
				{{ consultation.title }}
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
		<div class="user-controls border-t p-3 flex">
			<div class="left-controls">
				<!-- TODO(lead/button): Apply functionality -->
				<button class="material-icons">
					more_horiz
				</button>
				<!-- TODO(lead/button): Apply functionality -->
				<button class="material-icons">
					photo_camera
				</button>
				<!-- TODO(lead/button): Apply functionality -->
				<button class="material-icons">
					image
				</button>
			</div>
			<div class="message-box flex-1 border">
				<input type="text"/>
			</div>
			<div class="right-controls">
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
	</section>
</template>

<script setup lang="ts">
import { computed } from "vue"
import type { DeserializedChatMessageListDocument } from "$/types/documents/chat_message"
import type {
	DeserializedConsultationDocument,
	ConsultationRelationshipNames
} from "$/types/documents/consultation"

const { consultation } = defineProps<{
	consultation: DeserializedConsultationDocument<string, ConsultationRelationshipNames>
}>()
const consultationID = computed<string>(() => consultation.data.id)
const consultationStatus = computed<string>(() => consultation.data.status)
const consultationMessages = computed<DeserializedChatMessageListDocument<string>>(
	() => consultation.data.chatMessages as DeserializedChatMessageListDocument<string>
)
</script>
