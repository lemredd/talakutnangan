<!-- eslint-disable max-len -->
<template>
	<button
		class="print-btn material-icons fixed top-5 right-0 hover:bg-true-gray-500 p-2 hover:text-white"
		@click="printPage">
		print
	</button>

	<article class="form-page">
		<section class="header">
			<h1>Consultation Ticket #{{ consultation.data.id }}</h1>
		</section>

		<section class="details">
			<h2>
				Consultor Name:
			</h2>
			<h6 id="consultor" class="consultor">
				{{ consultor.data.name }}
			</h6>

			<h2>
				Consultor Role:
			</h2>
			<h6 id="consultor-role" class="consultor-role">
				{{ consultorRole.data.name }}
			</h6>

			<h2>
				Consultee(s):
			</h2>
			<ul id="consultees" class="consultees">
				<li
					v-for="consultee in consultees"
					:key="consultee.id"
					class="consultee">
					{{ consultee.user?.data.name }}
				</li>
			</ul>

			<h2>
				Reason:
			</h2>
			<h6 id="reason" class="reason">
				{{ reason }}
			</h6>
			<h6 id="actionTaken" class="actionTaken">
				{{ actionTaken }}
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
						Started At:
					</h2>
					<h6 id="actual-start" class="actual-start">
						{{ startedAt }}
					</h6>
				</div>

				<div class="col">
					<h2>
						Finished At:
					</h2>
					<h6 id="actual-finish" class="actual-finish">
						{{ finishedAt }}
					</h6>
				</div>
			</div>
		</section>
		<ul class="chat-messages mt-15">
			<h1>Chat Messages</h1>
			<li
				v-for="chatMessage in chatMessages.data"
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
			v-if="consultation.data.finishedAt"
			class="signatures mt-15">
			<h1>Signatures</h1>
			<div class="consultor-signature">
				<h2>Consultor</h2>
				<img :src="consultor.data.signature?.data.fileContents"/>
				<small>{{ consultor.data.name }}</small>
			</div>
			<div
				class="consultee-signature mt-5">
				<h2>Consultee/s</h2>
				<div
					v-for="consultee in consultees"
					:key="consultee.id">
					<img :src="consultee.user?.data.signature?.data.fileContents"/>
					<small>{{ consultee.user?.data.name }}</small>
				</div>
			</div>
		</section>

		<section v-else class="signatures not-finished">
			<span class="status-messages warning">
				Signatures will show here once the consultation has been finished.
			</span>
		</section>
	</article>
</template>

<style>
	body, #app {
		min-height: 100vh;
	}

	#app {
		@apply py-8 px-8;
	}
</style>

<style scoped lang="scss">
	@import "@styles/status_messages.scss";

	@page {
		margin: 0;
	}

	.form-page {
		@apply flex flex-col;
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
	.signatures {
		@apply mt-12;

		img { max-width: 120px; }
	}
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

		.form-page {
			.header {
				@apply order-1;
			}
			.details {
				@apply order-2;
			}
			.chat-messages {
				@apply order-4;
			}

			.signatures {
				@apply order-3;

				page-break-after: always;
				-moz-page-break-after: always;
				break-after: page;
			}
		}

		h6 {
			border-bottom: 1px solid black;
			@apply border-b mb-5;
		}

		.signatures {
			@apply order-1;
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
const finishedAt = computed<string>(() => {
	if (consultation.value.data.finishedAt) {
		return formatToCompleteFriendlyTime(consultation.value.data.finishedAt)
	}

	return "Consultation has not yet finished."
})
const reason = computed<string>(() => consultation.value.data.reason)
const actionTaken = computed<string>(() => {
	if (consultation.value.data.actionTaken) {
		return consultation.value.data.actionTaken
	}

	return "Please wait for the consultor to provide the action taken."
})
const consultor = computed<DeserializedUserDocument<"signature">>(() => {
	const user = consultation.value.data.consultor
	return user as DeserializedUserDocument<"signature">
})
const consultorRole = computed<DeserializedRoleDocument>(() => {
	const role = consultation.value.data.consultorRole
	return role as DeserializedRoleDocument
})

const consultationChatMessageActivities
= chatMessageActivitiesData as DeserializedChatMessageActivityResource[]
const consultees = consultationChatMessageActivities.filter(
	(
		activity: DeserializedChatMessageActivityResource
	) => activity.user?.data.id !== consultor.value.data.id
)

const chatMessages = ref<DeserializedChatMessageListDocument<"user">>(
	rawChatMessages as DeserializedChatMessageListDocument<"user">
)

function printPage() {
	if (!isUndefined(window) && consultation.value.data.finishedAt) {
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
