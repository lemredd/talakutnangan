<template>
	<div class="consultations-list left">
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

		<ConsultationForm :is-shown="isAddingSchedule" @close="toggleAddingSchedule"/>


		<button
			v-if="isUserAStudent"
			class="material-icons add absolute bottom-5 right-5 text-lg rounded-full border border-gray-600 p-3"
			@click="toggleAddingSchedule">
			add
		</button>

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
	.left {
		@apply dark:bg-dark-600 bg-white;
		position: fixed;
		overflow-y: scroll;
		inset: 0;

		@screen md {
			position: initial;
			width: calc(1920px / 5);
			@apply flex flex-col;
		}
	}

	.consultation.active {
		background-color: hsla(0, 0%, 50%, 0.1)
	}
</style>

<script setup lang="ts">
import { computed, inject, Ref, ref } from "vue"

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
import disableScroll from "$@/helpers/push_element_classes"
import EmptyLastChat from "@/consultation/list/empty_last_chat.vue"
import ProfilePictureItem from "@/consultation/list/profile_picture_item.vue"

import makeUniqueBy from "$/helpers/make_unique_by"


import SearchBar from "@/helpers/search_bar.vue"
import ConsultationForm from "@/consultation/form.vue"

const pageContext = inject("pageContext") as PageContext<"deserialized">

const slug = ref("")
const isSearching = ref(false)
function toggleSearch() {
	isSearching.value = !isSearching.value
}

const isAddingSchedule = ref<boolean>(false)
const rawBodyClasses = inject("bodyClasses") as Ref<string[]>
function toggleAddingSchedule() {
	disableScroll(rawBodyClasses, [ "unscrollable" ])
	isAddingSchedule.value = !isAddingSchedule.value
}

const { "pageProps": { userProfile } } = pageContext
const isUserAStudent = computed(() => userProfile?.data?.kind === "student")


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
