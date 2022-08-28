<template>
	<div class="consultations-list">
		<div
			v-for="consultation in consultations.data"
			:key="consultation.id"
			class="consultation"
			@click="pickConsultation(consultation.id)">
			<!-- TODO(others): must rearrange the pictures -->
			<div class="profile-pictures">
				<ProfilePictureItem
					v-for="activity in consultation.chatMessageActivities.data"
					:key="activity.id"
					:src="activity"/>
			</div>
			<h3 class="consultation-title col-span-full font-400">
				{{ consultation.title }}
			</h3>

			<LastChat
				v-if="consultation.chatMessages.data.length > 0"
				:chats="(consultation.chatMessages as DeserializedChatMessageListDocument<'user'>)"/>
			<EmptyLastChat v-else/>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { DeserializedChatMessageListDocument } from "$/types/documents/chat_message"
import type {
	ConsultationRelationshipNames,
	DeserializedConsultationListDocument
} from "$/types/documents/consultation"

import LastChat from "@/consultation/list/last_chat.vue"
import EmptyLastChat from "@/consultation/list/empty_last_chat.vue"
import ProfilePictureItem from "@/consultation/list/proile_picture_item.vue"

const {
	consultations
} = defineProps<{
	consultations: DeserializedConsultationListDocument<ConsultationRelationshipNames>
}>()

interface CustomEvents {
	(eventName: "pickedConsultation", ID: string): void
}
const emit = defineEmits<CustomEvents>()

function pickConsultation(consultationID: string) {
	emit("pickedConsultation", consultationID)
}
</script>
