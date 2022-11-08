<template>
	<div class="consultations-list left">
		<!-- TODO(others): use grid if applicable -->
		<div class="consultations-list-header">
			<h2>
				Consultations
			</h2>

			<MinorDropdown v-if="isUserAReachableEmployee" v-model="isDropdownShown">
				<template #dropdown-contents>
					<a class="link-to-reports" :href="CONSULTATION_REPORT_PER_STUDENT">
						View summary per student
					</a>
					<a class="link-to-reports" :href="CONSULTATION_WEEKLY_REPORT">
						View summary per week
					</a>
					<a class="link-to-reports" :href="CONSOLIDATED_CONSULTATION_REPORT">
						View overall summary
					</a>
				</template>
			</MinorDropdown>
		</div>

		<ConsultationForm :is-shown="isAddingSchedule" @close="toggleAddingSchedule"/>

		<button
			v-if="isUserAStudent"
			class="material-icons add-btn"
			@click="toggleAddingSchedule">
			add
		</button>

		<div
			v-for="consultation in consultations.data"
			:key="consultation.id"
			class="consultation"
			:class="getActivenessClass(consultation)"
			@click="pickConsultation(consultation.id)">
			<h3 class="consultation-title font-bold mb-3;">
				<span class="number-symbol">#{{ consultation.id }}</span>
				{{ consultation.reason }}
			</h3>
			<!-- TODO(others): style arrangement of pictures -->
			<div class="profile-pictures">
				<span class="participant-label">participants:</span>
				<ProfilePictureItem
					v-for="activity in getProfilePictures(consultation)"
					:key="activity.id"
					:user="activity.user"
					:title="activity.user.data.name"
					class="profile-picture-item"/>
			</div>

			<LastChat
				v-if="hasPreviewMessage(consultation)"
				:last-chat="getPreviewMessage(consultation)"/>
			<EmptyLastChat v-else/>
		</div>
	</div>
</template>

<style scoped lang="scss">
	@import "@styles/mixins.scss";


	.left {
		@apply dark:bg-dark-700 bg-white;
		position: fixed;
		overflow-y: scroll;
		left: 0; right: 0;
		z-index: 500;

		// TODO: find a way to make mixin `useContentBaseHeight` work
		height: calc(100vh - 56px);

		@screen md {
			position: relative;
			width: 40vw;
			max-width: 360px;
			@apply flex flex-col;
		}

		.consultations-list-header {
			@apply p-3 flex flex-row flex-nowrap justify-center items-center;

			h2 { @apply flex-1 uppercase; }

			.link-to-reports {
				@apply flex-1 max-h-[4rem] p-4;
			}

			.is-searching {
				@apply flex flex-1;

				.list-search-bar { @apply flex flex-1; }
			}
		}

		.add-btn {
			@apply absolute bottom-5 right-5;
			@apply rounded-full border border-gray-600 p-3;
			@apply text-lg;
		}
	}

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
import { computed, inject, Ref } from "vue"

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

import { BODY_CLASSES } from "$@/constants/provided_keys"
import {
	CONSULTATION_REPORT_PER_STUDENT,
	CONSULTATION_WEEKLY_REPORT,
	CONSOLIDATED_CONSULTATION_REPORT
} from "$/constants/template_page_paths"

import makeSwitch from "$@/helpers/make_switch"
import assignPath from "$@/external/assign_path"
import makeUniqueBy from "$/helpers/make_unique_by"
import specializePath from "$/helpers/specialize_path"
import BodyCSSClasses from "$@/external/body_css_classes"

import ConsultationForm from "@/consultation/form.vue"
import LastChat from "@/consultation/list/last_chat.vue"
import MinorDropdown from "@/helpers/minor_dropdown.vue"
import EmptyLastChat from "@/consultation/list/empty_last_chat.vue"
import ProfilePictureItem from "@/consultation/list/profile_picture_item.vue"

const pageContext = inject("pageContext") as PageContext<"deserialized">

const {
	"state": isDropdownShown
} = makeSwitch(false)

const {
	"toggle": toggleAddingScheduleState,
	"state": isAddingSchedule
} = makeSwitch(false)
const rawBodyClasses = inject(BODY_CLASSES) as Ref<BodyCSSClasses>
function toggleAddingSchedule() {
	rawBodyClasses.value.scroll(isAddingSchedule.value)
	toggleAddingScheduleState()
}

const { "pageProps": { userProfile } } = pageContext
const isUserAStudent = computed(() => userProfile.data.kind === "student")
const isUserAReachableEmployee = computed(() => userProfile.data.kind === "reachable_employee")

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
	assignPath(specializePath("/consultation/read/:id", {
		"id": consultationID
	}))
}
</script>
