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
			<ChatWindow
				:consultation="consultation"
				:chat-messages="chatMessages"
				@updated-consultation-attributes="updateConsultationAttributes"/>
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
import { provide, inject, ref, readonly, computed, onBeforeMount, onMounted } from "vue"

import type { PageContext } from "$/types/renderer"
import type {
	DeserializedChatMessageActivityResource,
	DeserializedChatMessageActivityListDocument
} from "$/types/documents/chat_message_activity"
import type {
	ConsultationAttributes,
	DeserializedConsultationResource,
	DeserializedConsultationListDocument
} from "$/types/documents/consultation"
import type {
	ChatMessageDocument,
	DeserializedChatMessageResource,
	DeserializedChatMessageDocument,
	DeserializedChatMessageListDocument
} from "$/types/documents/chat_message"

import { CHAT_MESSAGE_ACTIVITY } from "$@/constants/provided_keys"

import Socket from "$@/external/socket"
import deserialize from "$/object/deserialize"
import assignPath from "$@/external/assign_path"
import specializePath from "$/helpers/specialize_path"
import ChatMessageFetcher from "$@/fetchers/chat_message"
import ConsultationFetcher from "$@/fetchers/consultation"
import convertTimeToMilliseconds from "$/time/convert_time_to_milliseconds"
import ConsultationTimerManager from "$@/helpers/consultation_timer_manager"
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

const currentChatMessageActivityResource = computed<
	DeserializedChatMessageActivityResource<"user"|"consultation">
>(() => {
	const foundChatActivity = chatMessageActivities.value.data.find(activity => {
		const ownerID = activity.user.data.id
		return String(ownerID) === String(userProfile.data.id)
	}) as DeserializedChatMessageActivityResource<"user"|"consultation">

	return foundChatActivity
})

provide(CHAT_MESSAGE_ACTIVITY, readonly(currentChatMessageActivityResource))

function visitConsultation(consultationID: string): void {
	const path = specializePath("/consultation/:id", {
		"id": consultationID
	})
	assignPath(path)
}

function updateConsultationAttributes(updatedAttributes: ConsultationAttributes<"deserialized">)
: void {
	consultation.value = {
		...consultation.value,
		...updatedAttributes
	}
}

function mergeDeserializedMessages(messages: DeserializedChatMessageResource<"user">[]): void {
	chatMessages.value = {
		...chatMessages.value,
		"data": [
			...chatMessages.value.data,
			...messages
		].sort((first, second) => {
			const comparison = Math.sign(calculateMillisecondDifference(
				first.createdAt,
				second.createdAt
			))

			return comparison || first.id.localeCompare(second.id)
		})
	}
}

function createMessage(message: ChatMessageDocument<"read">): void {
	const deserializedMessage = deserialize(message) as DeserializedChatMessageDocument<"user">
	mergeDeserializedMessages([ deserializedMessage.data ])

	ConsultationTimerManager.restartTimerFor(consultation.value)
}

function updateMessage(message: ChatMessageDocument<"read">): void {
	const IDOfMessageToRemove = message.data.id
	chatMessages.value.data = chatMessages.value.data.filter(
		chatMessage => chatMessage.id !== IDOfMessageToRemove
	)

	createMessage(message)
}

onBeforeMount(() => {
	ConsultationFetcher.initialize("/api")
	ChatMessageFetcher.initialize("/api")
	Socket.initialize()

	const chatNamespace = makeConsultationChatNamespace(consultation.value.id)
	Socket.addEventListeners(chatNamespace, {
		"create": createMessage,
		"update": updateMessage
	})
})

let consultationFetcher: ConsultationFetcher|null = null

async function loadConsultations(): Promise<string[]> {
	if (consultationFetcher === null) {
		throw new Error("Consultations cannot be loaded yet.")
	}

	const { body } = await consultationFetcher.list({
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
	})

	const { data, meta } = body
	const consultationIDs: string[] = []

	if (meta?.count ?? data.length > 0) {
		const castData = data as DeserializedConsultationResource<"consultant"|"consultantRole">[]

		consultations.value.data = [
			...consultations.value.data,
			...castData
		]

		// TODO: Get preview messages per consultation
		return consultationIDs
	}

	return consultationIDs
}


let chatMessageFetcher: ChatMessageFetcher|null = null

async function loadPreviousChatMessages(): Promise<void> {
	if (chatMessageFetcher === null) {
		throw new Error("Consultations cannot be loaded yet.")
	}

	const { body } = await chatMessageFetcher.list({
		"filter": {
			"chatMessageKinds": [ "text", "status" ],
			"consultationIDs": [ consultation.value.id ],
			"existence": "exists",
			"previewMessageOnly": false
		},
		"page": {
			"limit": 10,
			"offset": chatMessages.value.data.length
		},
		"sort": [ "-createdAt" ]
	})

	const { data, meta } = body

	if (meta?.count ?? data.length > 0) {
		const castData = data as DeserializedChatMessageResource<"user">[]

		mergeDeserializedMessages(castData)
	}
}

onMounted(async() => {
	// Reinitialize since fetchers were now initialized properly
	consultationFetcher = new ConsultationFetcher()
	chatMessageFetcher = new ChatMessageFetcher()

	await loadConsultations()
	await loadPreviousChatMessages()

	setInterval(() => {
		ConsultationTimerManager.nextInterval()
	}, convertTimeToMilliseconds("00:00:01"))
})
</script>
