<template>
	<div
		:key="consultation.id"
		class="consultation"
		:class="{ 'active': mustBeActive }"
		@click="pickConsultation(consultation.id)">
		<h3 class="consultation-title font-bold mb-3;">
			<span class="number-symbol">#{{ consultation.id }}</span>
			{{ consultation.reason }}
		</h3>
		<!-- TODO(others): style arrangement of pictures -->
		<div class="profile-pictures">
			<span class="participant-label">participants:</span>
			<ProfilePictureItem
				v-for="activity in profilePictures"
				:key="activity.id"
				:user="activity.user"
				:title="activity.user.data.name"
				class="profile-picture-item"/>
		</div>

		<LastChat
			v-if="hasPreviewMessage"
			:last-chat="previewMessagge"/>
		<EmptyLastChat v-else/>
	</div>
</template>

<style scoped lang="scss">
	.consultation {
		@apply p-3;

		&.active {
			background-color: hsla(0, 0%, 50%, 0.1)
		}

		.number-symbol { @apply opacity-45; }
	}

	.profile-pictures {
		@apply flex;

		.participant-label { @apply mr-3; }
		.profile-picture-item {
			@apply rounded-full;
			width: 20px;
			height: 20px;
		}
	}
</style>

<script setup lang="ts">
import { computed, inject } from "vue"
import type { PageContext } from "$/types/renderer"
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
	DeserializedConsultationResource
} from "$/types/documents/consultation"

import assignPath from "$@/external/assign_path"
import makeUniqueBy from "$/helpers/make_unique_by"
import specializePath from "$/helpers/specialize_path"

import LastChat from "@/consultation/list/last_chat.vue"
import EmptyLastChat from "@/consultation/list/empty_last_chat.vue"
import ProfilePictureItem from "@/consultation/list/profile_picture_item.vue"

const pageContext = inject("pageContext") as PageContext<"deserialized">

const props = defineProps<{
	chatMessageActivities: DeserializedChatMessageActivityListDocument<"user"|"consultation">,
	consultation: DeserializedConsultationResource<ConsultationRelationshipNames>,
	previewMessages: DeserializedChatMessageListDocument<"user"|"consultation">
}>()

const ownedActivities = computed<DeserializedChatMessageActivityResource<"user">[]>(() => {
	const activities = props.chatMessageActivities.data.filter(
		activity => activity.consultation.data.id === props.consultation.id
	)

	return activities
})

const profilePictures = computed<DeserializedChatMessageActivityResource<"user">[]>(() => {
	const activities = makeUniqueBy(ownedActivities.value, "user.data.id")

	return activities
})

const mustBeActive = computed<boolean>(
	() => pageContext.urlPathname === `/consultation/${props.consultation.id}`
)

const previewMessageIndex = computed<number>(() => props.previewMessages.data.findIndex(
	message => message.consultation.data.id === props.consultation.id
))
const hasPreviewMessage = computed<boolean>(() => previewMessageIndex.value > -1)
const previewMessagge = computed<DeserializedChatMessageResource<"user">>(
	() => props.previewMessages.data[previewMessageIndex.value]
)

function pickConsultation(consultationID: string) {
	assignPath(specializePath("/consultation/read/:id", {
		"id": consultationID
	}))
}
</script>
