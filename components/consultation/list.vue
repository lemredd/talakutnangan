<template>
	<div class="consultations-list">
		<!-- TODO(others): Refactor all WindiCSS inline classes using @apply directive -->
		<!-- TODO(others): use grid if applicable -->
		<div class="consultations-list-header p-3">
			<div v-if="!isSearching" class="no-search-bar flex flex-1">
				<h2 class="flex-1">
					Consultations
				</h2>

				<button
					class="material-icons search"
					@click="toggleSearch">
					search
				</button>
			</div>
			<div
				v-else
				class="is-searching flex flex-1">
				<!-- TODO(lead/button): search existing consultations -->

				<SearchBar v-model="slug" class="flex flex-1"/>
				<button class="material-icons text-xs" @click="toggleSearch">
					close
				</button>
			</div>
		</div>
		<div
			v-for="consultation in consultations.data"
			:key="consultation.id"
			class="consultation p-3"
			:class="getActivenessClass(consultation)"
			@click="pickConsultation(consultation.id)">
			<h3 class="consultation-title col-span-full font-bold mb-3">
				<span class="opacity-45">#{{ consultation.id }}</span>
				{{ consultation.reason }}
			</h3>
			<!-- TODO(others): style arrangement of pictures -->
			<div class="profile-pictures flex">
				<span class="mr-3">participants:</span>
				<ProfilePictureItem
					v-for="activity in getProfilePictures(consultation)"
					:key="activity.id"
					:activity="activity"
					:title="activity.user.data.name"
					class="profile-picture-item rounded-full w-[20px] h-[20px]"/>
			</div>

			<LastChat
				v-if="hasPreviewMessage(consultation)"
				:last-chat="getPreviewMessage(consultation)"/>
			<EmptyLastChat v-else/>
		</div>
	</div>
</template>

<style scoped lang="scss">
	.consultation.active {
		background-color: hsla(0, 0%, 50%, 0.1)
	}
</style>

<script setup lang="ts">
import { inject, ref } from "vue"

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
	DeserializedConsultationResource,
	DeserializedConsultationListDocument
} from "$/types/documents/consultation"

import assignPath from "$@/external/assign_path"

import LastChat from "@/consultation/list/last_chat.vue"
import EmptyLastChat from "@/consultation/list/empty_last_chat.vue"
import ProfilePictureItem from "@/consultation/list/profile_picture_item.vue"

import makeUniqueBy from "$/helpers/make_unique_by"

import SearchBar from "@/helpers/search_bar.vue"


const slug = ref("")
const isSearching = ref(false)
function toggleSearch() {
	isSearching.value = !isSearching.value
}

const pageContext = inject("pageContext") as PageContext

const {
	consultations,
	chatMessageActivities,
	previewMessages
} = defineProps<{
	chatMessageActivities: DeserializedChatMessageActivityListDocument<"user"|"consultation">,
	consultations: DeserializedConsultationListDocument<ConsultationRelationshipNames>,
		previewMessages: DeserializedChatMessageListDocument<"user"|"consultation">
}>()

function getActivenessClass(
	consultation: DeserializedConsultationResource<ConsultationRelationshipNames>
) {
	return { "active": pageContext.urlPathname === `/consultation/${consultation.id}` }
}
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
