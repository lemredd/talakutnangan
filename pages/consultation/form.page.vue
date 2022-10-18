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

		<div class="schedules flex justify-between max-w-[900px]">
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
		</div>
	</section>

	<ul class="chat-messages">
		<h1>Chat Messages</h1>
		<li
			v-for="chatMessage in chatMessages"
			:key="chatMessage.id">
			<span class="date-and-owner-details">
				[
				{{ chatMessage.createdAt.toDateString() }}
				{{ chatMessage.createdAt.getHours() }}:{{ chatMessage.createdAt.getMinutes() }}:{{ chatMessage.createdAt.getSeconds() }}
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
		@apply border-b border-b-light-500 mb-5;
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
import { inject } from "vue"

import type { PageContext } from "$/types/renderer"
import type { DeserializedUserResource } from "$/types/documents/user"
import type { DeserializedRoleDocument } from "$/types/documents/role"
import type { DeserializedChatMessageResource } from "$/types/documents/chat_message"
import type { DeserializedConsultationResource } from "$/types/documents/consultation"
import type {
	DeserializedChatMessageActivityResource
} from "$/types/documents/chat_message_activity"

import {
	isMessageKindFile,
	isMessageKindStatus,
	isMessageKindText
} from "@/consultation/helpers/chat_message_kinds"
import isUndefined from "$/type_guards/is_undefined"

const pageContext = inject("pageContext") as PageContext<"deserialized">
const {
	"pageProps": {
		"chatMessageActivities": {
			"data": chatMessageActivitiesData
		},
		"chatMessages": {
			"data": chatMessagesData
		},
		"consultation": {
			"data": consultationData
		}
	}
} = pageContext as PageContext<
	"deserialized",
	"consultation"|"chatMessageActivities"|"chatMessages"
>

const consultation = consultationData as DeserializedConsultationResource
const {
	consultant,
	consultantRole,
	reason,
	scheduledStartAt,
	startedAt
} = consultation as unknown as {
	"consultant": DeserializedUserResource
	"consultantRole": DeserializedRoleDocument
	"reason": string
	"scheduledStartAt": Date
	"startedAt": Date
}

const consultationChatMessageActivities
= chatMessageActivitiesData as DeserializedChatMessageActivityResource[]
const consulters = consultationChatMessageActivities.filter(
	(
		activity: DeserializedChatMessageActivityResource
	) => activity.user?.data.id !== consultant.data.id
)

const chatMessages = chatMessagesData as DeserializedChatMessageResource<"user">[]

function printPage() {
	if (!isUndefined(window)) {
		window.print()
	}
}
</script>
