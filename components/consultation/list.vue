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

			<small class="last-chat span">
				<!-- TODO(others): must limit length -->
				{{
					consultation.chats
						? consultation.chats[consultation.chats.length - 1]
						: "Start by saying hello!"
				}}
			</small>

			<div class="last-chat-time-sent">
				<!-- TODO(lead): Replace with real value soon -->
				HH:MM
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import type {
	ConsultationRelationshipNames,
	DeserializedConsultationListDocument
} from "$/types/documents/consultation"

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
