<!--
	General tasks for other members:
	TODO(others): Refactor all WindiCSS inline classes using @apply directive
	TODO(others): Refactor HTML to Vue Components if applicable
	TODO(others): Make use of mixins if applicable
-->
<template>
	<ConsultationShell>
		<template #list>
			<ConsultationList
				:consultations="consultations"
				:chat-message-activities="chatMessageActivities"
				:preview-messages="previewMessages"
				@picked-consultation="visitConsultation"/>
		</template>
		<template #chat-window>
			<ChatWindow :consultation="consultation" :chat-messages="chatMessages"/>
		</template>
	</ConsultationShell>
</template>

<style lang="scss">
.content {
	padding: 0 !important;

	.container {
		max-width: none;
		margin: 0 !important;
	}
}
footer {
	display: none !important;
}
</style>

<script setup lang="ts">
import { inject, ref, onBeforeMount, onMounted } from "vue"

import type { PageContext } from "$/types/renderer"
import type {
	DeserializedChatMessageActivityListDocument
} from "$/types/documents/chat_message_activity"
import type {
	DeserializedConsultationResource,
	DeserializedConsultationListDocument
} from "$/types/documents/consultation"
import type {
	ChatMessageDocument,
	DeserializedChatMessageDocument,
	DeserializedChatMessageListDocument
} from "$/types/documents/chat_message"

import Socket from "$@/external/socket"
import deserialize from "$/helpers/deserialize"
import assignPath from "$@/external/assign_path"
import specializePath from "$/helpers/specialize_path"
import ConsultationFetcher from "$@/fetchers/consultation"
import makeConsultationChatNamespace from "$/namespace_makers/consultation_chat"
import calculateMillisecondDifference from "$@/helpers/calculate_millisecond_difference"

import ConsultationList from "@/consultation/list.vue"
import ChatWindow from "@/consultation/chat_window.vue"
import ConsultationShell from "@/consultation/page_shell.vue"

type RequiredExtraProps =
	| "userProfile"
	| "consultation"
	| "consultations"
	| "previewMessages"
	| "chatMessages"
	| "chatMessageActivities"
const pageContext = inject("pageContext") as PageContext<"deserialized", RequiredExtraProps>
const { pageProps } = pageContext

const { userProfile } = pageProps

const consultation = ref<DeserializedConsultationResource<"consultant"|"consultantRole">>(
	pageProps.consultation.data as DeserializedConsultationResource<"consultant"|"consultantRole">
)

const consultations = ref<DeserializedConsultationListDocument<"consultant"|"consultantRole">>(
	pageProps.consultations as DeserializedConsultationListDocument<"consultant"|"consultantRole">
)

const previewMessages = ref<DeserializedChatMessageListDocument<"user"|"consultation">>(
	pageProps.previewMessages as DeserializedChatMessageListDocument<"user"|"consultation">
)

const chatMessages = ref<DeserializedChatMessageListDocument<"user">>(
	pageProps.chatMessages as DeserializedChatMessageListDocument<"user">
)

const chatMessageActivities = ref<
	DeserializedChatMessageActivityListDocument<"user"|"consultation">
>(
	pageProps.chatMessageActivities as DeserializedChatMessageActivityListDocument<
		"user"|"consultation"
	>
)

function visitConsultation(consultationID: string): void {
	const path = specializePath("/consultation/:id", {
		"id": consultationID
	})
	assignPath(path)
}

function createMessage(message: ChatMessageDocument<"read">): void {
	const deserializedMessage = deserialize(message) as DeserializedChatMessageDocument<"user">
	chatMessages.value = {
		...chatMessages.value,
		"data": [
			...chatMessages.value.data,
			deserializedMessage.data
		].sort((first, second) => {
			const comparison = Math.sign(calculateMillisecondDifference(
				first.createdAt,
				second.createdAt
			))

			return comparison || Math.sign(Number(first.id) - Number(second.id))
		})
	}
}

function updateMessage(message: ChatMessageDocument<"read">): void {
	const IDofMessageToRemove = message.data.id
	chatMessages.value.data = chatMessages.value.data.filter(
		chatMessage => chatMessage.id !== IDofMessageToRemove
	)

	createMessage(message)
}

onBeforeMount(() => {
	ConsultationFetcher.initialize("/api")
	Socket.initialize()

	const chatNamespace = makeConsultationChatNamespace(consultation.value.id)
	Socket.addEventListeners(chatNamespace, {
		"create": createMessage,
		"update": updateMessage
	})
})

onMounted(() => {
	const fetcher = new ConsultationFetcher()
	fetcher.list({
		"filter": {
			"consultationScheduleRange": "*",
			"existence": "exists",
			"user": userProfile.data.id
		},
		"page": {
			"limit": 10,
			"offset": consultations.value.data.length
		},
		"sort": [ "-updatedAt" ]
	}).then(({ body, unusedStatus }) => {
		const { data, meta } = body

		if (meta?.count ?? data.length > 0) {
			const castData = data as DeserializedConsultationResource<"consultant"|"consultantRole">[]

			consultations.value.data = [
				...consultations.value.data,
				...castData
			]

			// TODO: Get preview messages per consultation
			return []
		}

		return []
	}).catch(({ unusedBody, unusedStatus }) => {
		// Fail
	})
})
</script>
