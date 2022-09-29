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
import { provide, inject, ref, readonly, computed, onMounted } from "vue"

import type { PageContext } from "$/types/renderer"
import type {
	ChatMessageActivityDocument,
	DeserializedChatMessageActivityResource,
	DeserializedChatMessageActivityListDocument
} from "$/types/documents/chat_message_activity"
import type {
	ConsultationResource,
	ConsultationAttributes,
	DeserializedConsultationDocument,
	DeserializedConsultationResource,
	DeserializedConsultationListDocument
} from "$/types/documents/consultation"
import type {
	DeserializedChatMessageResource,
	DeserializedChatMessageListDocument
} from "$/types/documents/chat_message"

import { CHAT_MESSAGE_ACTIVITY } from "$@/constants/provided_keys"

import Socket from "$@/external/socket"
import deserialize from "$/object/deserialize"
import assignPath from "$@/external/assign_path"
import specializePath from "$/helpers/specialize_path"
import ChatMessageFetcher from "$@/fetchers/chat_message"
import ConsultationFetcher from "$@/fetchers/consultation"
import makeConsultationNamespace from "$/namespace_makers/consultation"

import ChatMessageActivityFetcher from "$@/fetchers/chat_message_activity"
import convertTimeToMilliseconds from "$/time/convert_time_to_milliseconds"
import ConsultationTimerManager from "$@/helpers/consultation_timer_manager"
import makeConsultationChatActivityNamespace from "$/namespace_makers/consultation_chat_activity"

import ConsultationList from "@/consultation/list.vue"
import ChatWindow from "@/consultation/chat_window.vue"
import ConsultationShell from "@/consultation/page_shell.vue"
import mergeDeserializedMessages from "@/consultation/helpers/merge_deserialized_messages"
import registerChatListeners from "@/consultation/listeners/register_chat"

ChatMessageFetcher.initialize("/api")
ConsultationFetcher.initialize("/api")
ChatMessageActivityFetcher.initialize("/api")
Socket.initialize()

const chatMessageActivityFetcher = new ChatMessageActivityFetcher()

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
function updateMessageActivity(activity: ChatMessageActivityDocument<"read">): void {
	const deserializedActivity = deserialize(activity) as ChatMessageActivityDocument<"read">
	const receivedData = deserializedActivity.data
	const receivedID = receivedData.id

	chatMessageActivities.value.data = chatMessageActivities.value.data.map(resource => {
		const activityID = resource.id

		if (activityID === receivedID) {
			return {
				...resource,
				...receivedData
			}
		}

		return resource
	})
}

function updateConsultation(updatedConsultation: ConsultationResource<"read">): void {
	const deserializedConsultation = deserialize(
		updatedConsultation
	) as DeserializedConsultationDocument<"read">

	consultation.value = {
		...consultation.value,
		...deserializedConsultation.data
	}
}

const chatMessageFetcher = new ChatMessageFetcher()
async function loadPreviousChatMessages(): Promise<void> {
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

		mergeDeserializedMessages(chatMessages, castData)
	}
}

async function loadPreviewMessages(consultationIDs: string[]): Promise<void> {
	const { body } = await chatMessageFetcher.list({
		"filter": {
			"chatMessageKinds": "*",
			consultationIDs,
			"existence": "exists",
			"previewMessageOnly": true
		},
		"page": {
			"limit": 10,
			"offset": 0
		},
		"sort": [ "-createdAt" ]
	})

	const { data, meta } = body

	if (meta?.count ?? data.length > 0) {
		previewMessages.value.data.push(
			...data as DeserializedChatMessageResource<"user"|"consultation">[]
		)
	}
}

const fetcher = new ConsultationFetcher()
async function loadConsultations(): Promise<void> {
	const { body } = await fetcher.list({
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

	if (meta?.count ?? data.length > 0) {
		const castData = data as DeserializedConsultationResource<"consultant"|"consultantRole">[]

		consultations.value.data = [
			...consultations.value.data,
			...castData
		]

		await loadPreviewMessages(castData.map(resource => resource.id))
	}
}

registerChatListeners(
	consultation,
	chatMessages,
	currentChatMessageActivityResource,
	chatMessageActivityFetcher
)

const consultationNamespace = makeConsultationNamespace(consultation.value.id)
Socket.addEventListeners(consultationNamespace, {
	"update": updateConsultation
})

const chatActivityNamespace = makeConsultationChatActivityNamespace(consultation.value.id)
Socket.addEventListeners(chatActivityNamespace, {
	"update": updateMessageActivity
})

onMounted(async() => {
	await loadConsultations()
	await loadPreviousChatMessages()

	setInterval(() => {
		ConsultationTimerManager.nextInterval()
	}, convertTimeToMilliseconds("00:00:01"))
})
</script>
