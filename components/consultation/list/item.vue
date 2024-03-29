<template>
	<div
		:key="consultation.id"
		class="consultation"
		:class="{ 'active': mustBeActive }"
		@click="pickConsultation">
		<h3 class="consultation-title">
			<div class="number-and-title">
				<span class="number-symbol">#{{ consultation.id }}</span>
				{{ consultation.reason }}
			</div>
			<div class="badges">
				<small
					v-if="isUrgent"
					class="badge urgent-badge"
					:class="statusBadgeClasses">
					urgent
				</small>
				<small
					class="badge status-badge"
					:class="statusBadgeClasses">
					{{ statusBadge }}
				</small>
			</div>
		</h3>
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
			:last-chat="previewMessage"/>
		<EmptyLastChat v-else/>
	</div>
</template>

<style scoped lang="scss">
	@import "@styles/variables.scss";

	.consultation {
		@apply p-3;
		cursor: pointer;

		&.active {
			background-color: hsla(0, 0%, 50%, 0.1)
		}

		.consultation-title {
			@apply flex flex-col;
			@apply font-bold mb-3;

			@screen sm {
				@apply flex-row flex-wrap justify-between items-center;
			}

			.badges {
				& > :not(:first-child) {
					@apply ml-1;
				}

				.badge {
					@apply p-1 text-xs rounded-0.5em;
					@apply bg-opacity-10;
					@apply text-white uppercase;

					&.urgent-badge {
						@apply bg-yellow-500;
					}

					&.status-badge {
						background-color: $color-primary;

						&.canceled {
							@apply bg-red-700 bg-opacity-100;
						}
						&.scheduled {
							@apply bg-dark-50 bg-opacity-100;
						}
						&.ongoing {
							@apply bg-green-500 bg-opacity-100;
						}
						&.finished {
							@apply bg-blue-500 bg-opacity-100;
						}
					}
				}
			}
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

import { READ_CONSULTATION } from "$/constants/template_page_paths"

import assignPath from "$@/external/assign_path"
import makeUniqueBy from "$/helpers/make_unique_by"
import specializePath from "$/helpers/specialize_path"

import LastChat from "@/consultation/list/last_chat.vue"
import EmptyLastChat from "@/consultation/list/empty_last_chat.vue"
import ProfilePictureItem from "@/consultation/list/profile_picture_item.vue"
import makeConsultationStates from "@/consultation/helpers/make_consultation_states"

const pageContext = inject("pageContext") as PageContext<"deserialized">

const props = defineProps<{
	chatMessageActivities: DeserializedChatMessageActivityListDocument<"user"|"consultation">,
	consultation: DeserializedConsultationResource<ConsultationRelationshipNames>,
	previewMessages: DeserializedChatMessageListDocument<"user"|"consultation">
}>()

const consultationID = computed<string>(() => props.consultation.id)

const readURL = computed<string>(() => specializePath(READ_CONSULTATION, {
	"id": consultationID.value
}))
const {
	isCanceled,
	isDone,
	isOngoing,
	isUrgent,
	willSoonStart,
	willStart
} = makeConsultationStates(props as unknown as {
	"consultation": DeserializedConsultationResource<"consultor"|"consultorRole">
})
const statusBadge = computed(() => {
	let status = ""

	if (isDone.value) status = "Finished"
	if (isOngoing.value) status = "Ongoing"
	if (willSoonStart.value || willStart.value && !isCanceled.value) status = "Scheduled"
	if (isCanceled.value) status = "Canceled"

	return status
})
const statusBadgeClasses = computed(() => ({
	"canceled": isCanceled.value,
	"finished": isDone.value,
	"ongoing": isOngoing.value,
	"scheduled": willSoonStart.value || willStart.value
}))

const profilePictures = computed<DeserializedChatMessageActivityResource<"user">[]>(() => {
	const activities = makeUniqueBy(props.chatMessageActivities.data, "user.data.id")

	return activities
})

const mustBeActive = computed<boolean>(
	() => pageContext.urlPathname === readURL.value
)

const previewMessageIndex = computed<number>(() => props.previewMessages.data.findIndex(
	message => message.consultation.data.id === props.consultation.id
))
const hasPreviewMessage = computed<boolean>(() => previewMessageIndex.value > -1)
const previewMessage = computed<DeserializedChatMessageResource<"user">>(
	() => props.previewMessages.data[previewMessageIndex.value]
)

function pickConsultation() {
	assignPath(readURL.value)
}
</script>
