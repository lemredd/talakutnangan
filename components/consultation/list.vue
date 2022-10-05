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
					v-for="activity in getProfilePictures(consultation)"
					:key="activity.id"
					:activity="activity"
					class="rounded-full w-[50px] h-[50px]"/>
			</div>
			<h3 class="consultation-title col-span-full font-400">
				#{{ consultation.id }} {{ consultation.reason }}
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

import assignPath from "$@/external/assign_path"

import LastChat from "@/consultation/list/last_chat.vue"
import EmptyLastChat from "@/consultation/list/empty_last_chat.vue"
import ProfilePictureItem from "@/consultation/list/profile_picture_item.vue"

import makeUniqueBy from "$/helpers/make_unique_by"
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
	return chatMessageActivities.data.filter(
		activity => activity.consultation.data.id === consultation.id
	)
}
function getProfilePictures(
	consultation: DeserializedConsultationResource<ConsultationRelationshipNames>
) {
	return makeUniqueBy(getChatMessageActivities(consultation), "user.data.id")
}

function findPreviewMessageIndex(
	consultation: DeserializedConsultationResource<ConsultationRelationshipNames>
): number {
	return previewMessages.data.findIndex(
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

function pickConsultation(consultationID: string) {
	assignPath(`/consultation/${consultationID}`)
}
</script>
