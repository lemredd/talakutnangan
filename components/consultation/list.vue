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
					v-for="activity in getChatMessageActivities(consultation)"
					:key="activity.id"
					:activity="activity"/>
			</div>
			<h3 class="consultation-title col-span-full font-400">
				<!-- TODO: Derive the title from reason and consultants -->
				{{ consultation.reason }}
			</h3>

			<LastChat
				v-if="hasPreviewMessage(consultation)"
				:last-chat="getPreviewMessage(consultation)"/>
			<EmptyLastChat v-else/>
		</div>
	</div>
</template>

<script setup lang="ts">
import type {
	DeserializedChatMessageActivityResource,
	DeserializedChatMessageActivityListDocument
} from "$/types/documents/chat_message_activity"
import type {
	DeserializedChatMessageResource,
	DeserializedChatMessageListDocument
} from "$/types/documents/chat_message"
import type {
	ConsultationRelationshipNames,
	DeserializedConsultationResource,
	DeserializedConsultationListDocument
} from "$/types/documents/consultation"

import LastChat from "@/consultation/list/last_chat.vue"
import EmptyLastChat from "@/consultation/list/empty_last_chat.vue"
import ProfilePictureItem from "@/consultation/list/profile_picture_item.vue"

const {
	consultations,
	chatMessageActivities,
	previewMessages
} = defineProps<{
	chatMessageActivities: DeserializedChatMessageActivityListDocument<"user"|"consultation">,
	consultations: DeserializedConsultationListDocument<ConsultationRelationshipNames>,
	previewMessages: DeserializedChatMessageListDocument<"user"|"consultation">
}>()

function getChatMessageActivities(
	consultation: DeserializedConsultationResource<ConsultationRelationshipNames>
): DeserializedChatMessageActivityResource<"user">[] {
	const index = findPreviewMessageIndex(consultation)

	return chatMessageActivities.data.filter(
		activity => activity.consultation.data.id === consultation.id
	)
}

function findPreviewMessageIndex(
	consultation: DeserializedConsultationResource<ConsultationRelationshipNames>
): number {
	return  previewMessages.data.findIndex(
		message => message.consultation.data.id === consultation.id
	)
}

function hasPreviewMessage(
	consultation: DeserializedConsultationResource<ConsultationRelationshipNames>
): boolean {
	const index = findPreviewMessageIndex(consultation)

	return index > -1
}

function getPreviewMessage(
	consultation: DeserializedConsultationResource<ConsultationRelationshipNames>
): DeserializedChatMessageResource<"user"> {
	const index = findPreviewMessageIndex(consultation)

	return previewMessages.data[index]
}

interface CustomEvents {
	(eventName: "pickedConsultation", ID: string): void
}
const emit = defineEmits<CustomEvents>()

function pickConsultation(consultationID: string) {
	emit("pickedConsultation", consultationID)
}
</script>
