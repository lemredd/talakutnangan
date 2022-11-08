<!-- eslint-disable max-len -->
<template>
	<!-- TODO: Refactor all WindiCSS inline classes using @apply directive -->
	<button
		class="print-btn material-icons fixed top-5 right-0 hover:bg-true-gray-500 p-2 hover:text-white"
		@click="printPage">
		print
	</button>

	<section class="header">
		<h1>Consultation Ticket #{{ consultation.id }}</h1>
	</section>

	<section class="details">
		<h2>
			Consultant Name:
		</h2>
		<h6 id="consultant" class="consultant">
			{{ consultant.data.name }}
		</h6>

		<h2>
			Consultant Role:
		</h2>
		<h6 id="consultant-role" class="consultant-role">
			{{ consultantRole.data.name }}
		</h6>

		<h2>
			Consulter/s:
		</h2>
		<ul id="consulters" class="consulters">
			<li
				v-for="consulter in consulters"
				:key="consulter.id"
				class="consulter">
				{{ consulter.user?.data.name }}
			</li>
		</ul>

		<h2>
			Reason:
		</h2>
		<h6 id="reason" class="reason">
			{{ reason }}
		</h6>

		<div class="schedules">
			<div class="col">
				<h2>
					Scheduled Start:
				</h2>
				<h6 id="scheduled-start" class="scheduled-start">
					{{ scheduledStartAt }}
				</h6>
			</div>

			<div class="col">
				<h2>
					Actual Start:
				</h2>
				<h6 id="actual-start" class="actual-start">
					{{ startedAt }}
				</h6>
			</div>
				</h6>
			</div>
		</div>
	</section>
	<ul class="chat-messages mt-15">
		<h1>Chat Messages</h1>
		<li
			v-for="chatMessage in chatMessages"
			:key="chatMessage.id">
			<span class="date-and-owner-details">
				[
				{{ formatToCompleteFriendlyTime(chatMessage.createdAt) }}
				]
				({{ chatMessage.user.data.name }})
			</span>
			<span v-if="isMessageKindStatus(chatMessage)" class="status-message">
				{{ chatMessage.data.value }}
			</span>
			<span v-if="isMessageKindText(chatMessage)" class="text-message">
				: {{ chatMessage.data.value }}
			</span>
			<span v-if="isMessageKindFile(chatMessage)" class="file-message">
				sent an <a :href="chatMessage.attachedChatFile.data.fileContents">attachment</a>
			</span>
		</li>
	</ul>

	<section
		v-if="consultationData.finishedAt"
		class="signatures mt-15">
		<h1>Signatures</h1>
		<div class="consultant-signature">
			<h2>Consultant</h2>
			<img :src="consultant.data.signature?.data.fileContents"/>
			<small>{{ consultant.data.name }}</small>
		</div>
		<div
			class="consulter-signature mt-5">
			<h2>Consulter/s</h2>
			<div
				v-for="consulter in consulters"
				:key="consulter.id">
				<img :src="consulter.user?.data.signature?.data.fileContents"/>
				<small>{{ consulter.user?.data.name }}</small>
			</div>
		</div>
	</section>

	<section v-else class="signatures">
		Signatures will show here once the consultation has been finished.
	</section>
</template>

<style scoped lang="scss">
	@page {
		margin: 0;
	}

	h1 {
		@apply text-2xl;
	}

	h2 {
		@apply text-lg;
	}

	h6 {
		@apply border-b mb-5;
	}
	.signatures img { max-width: 120px; }

	.schedules{
		@apply flex justify-between max-w-900px;
	}

	.file-message a { text-decoration: underline; }
	@media print {
		h1 {
			@apply text-2xl;
		}

		h2 {
			@apply text-lg;
		}

		h6 {
			border-bottom: 1px solid black;
			@apply border-b mb-5;
		}

		.file-message a { text-decoration: underline; }
	}
</style>

<script setup lang="ts">
import { inject, ref, onMounted, computed, Ref } from "vue"

import type { PageContext } from "$/types/renderer"
import type { DeserializedUserDocument } from "$/types/documents/user"
import type { DeserializedRoleDocument } from "$/types/documents/role"
import type { DeserializedConsultationDocument } from "$/types/documents/consultation"
import type { DeserializedChatMessageListDocument } from "$/types/documents/chat_message"
import type {
	DeserializedChatMessageActivityResource
} from "$/types/documents/chat_message_activity"

import { DEFAULT_LIST_LIMIT } from "$/constants/numerical"

import ChatMessageFetcher from "$@/fetchers/chat_message"
import isUndefined from "$/type_guards/is_undefined"
import loadRemainingResource from "$@/helpers/load_remaining_resource"
import formatToCompleteFriendlyTime from "$@/helpers/format_to_complete_friendly_time"
import {
	isMessageKindFile,
	isMessageKindStatus,
	isMessageKindText
} from "@/consultation/helpers/chat_message_kinds"

const pageContext = inject("pageContext") as PageContext<"deserialized">
const {
	"pageProps": {
		"chatMessageActivities": {
			"data": chatMessageActivitiesData
		},
		"chatMessages": rawChatMessages,
		"consultation": rawConsultation
	}
} = pageContext as PageContext<
	"deserialized",
	"consultation"|"chatMessageActivities"|"chatMessages"
>

const consultation = ref<DeserializedConsultationDocument>(rawConsultation)
const scheduledStartAt = computed<string>(() => formatToCompleteFriendlyTime(
	consultation.value.data.scheduledStartAt
))
const startedAt = computed<string>(() => {
	if (consultation.value.data.startedAt) {
		return formatToCompleteFriendlyTime(consultation.value.data.startedAt)
	}

	return "Consultation has not yet started."
})
const reason = computed<string>(() => consultation.value.data.reason)
const consultant = computed<DeserializedUserDocument<"signature">>(() => {
	const user = consultation.value.data.consultant
	return user as DeserializedUserDocument<"signature">
})
const consultantRole = computed<DeserializedRoleDocument>(() => {
	const role = consultation.value.data.consultantRole
	return role as DeserializedRoleDocument
})

const consultationChatMessageActivities
= chatMessageActivitiesData as DeserializedChatMessageActivityResource[]
const consulters = consultationChatMessageActivities.filter(
	(
		activity: DeserializedChatMessageActivityResource
	) => activity.user?.data.id !== consultant.value.data.id
)

const chatMessages = ref<DeserializedChatMessageListDocument<"user">>(
	rawChatMessages as DeserializedChatMessageListDocument<"user">
)

function printPage() {
	if (!isUndefined(window)) {
		window.print()
	}
}

const chatMessageFetcher = new ChatMessageFetcher()
onMounted(async() => {
	await loadRemainingResource(
		chatMessages as Ref<DeserializedChatMessageListDocument>,
		chatMessageFetcher,
		() => ({
			"filter": {
				"chatMessageKinds": "*",
				"consultationIDs": [ Number(consultation.value.data.id) ],
				"existence": "exists",
				"previewMessageOnly": false
			},
			"page": {
				"limit": DEFAULT_LIST_LIMIT,
				"offset": chatMessages.value.data.length
			},
			"sort": [ "createdAt" ]
		})
	)
})
</script>
