<template>
	<ConsultationShell>
		<template #list>
			<ConsultationList
				v-if="isConsultationListShown"
				:consultations="consultations"
				:chat-message-activities="chatMessageActivities"
				:preview-messages="previewMessages"/>
		</template>
		<template #chat-window>
			<ChatWindow
				:consultation="consultation"
				:chat-messages="chatMessages"
				:is-consultation-list-shown="isConsultationListShown"
				@updated-consultation-attributes="updateConsultationAttributes"
				@toggle-consultation-list="toggleConsultationList"/>
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
footer:not(.overlay-footer) {
	display: none !important;
}
</style>

<style scoped lang="scss">
.toggle-list-btn {
	@apply fixed opacity-15 hover:opacity-100;
	@apply bg-gray-500 text-light-300 dark:bg-light-300 dark:text-dark-300;
}
</style>

<script setup lang="ts">
import { provide, inject, ref, readonly, computed, onMounted } from "vue"

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
	DeserializedChatMessageResource,
	DeserializedChatMessageListDocument
} from "$/types/documents/chat_message"

import {
	CHAT_MESSAGE_ACTIVITY,
	CHAT_MESSAGE_ACTIVITIES_IN_CONSULTATION
} from "$@/constants/provided_keys"

import Socket from "$@/external/socket"
import ChatMessageFetcher from "$@/fetchers/chat_message"
import ConsultationFetcher from "$@/fetchers/consultation"

import ChatMessageActivityFetcher from "$@/fetchers/chat_message_activity"
import convertTimeToMilliseconds from "$/time/convert_time_to_milliseconds"
import ConsultationTimerManager from "$@/helpers/consultation_timer_manager"

import ConsultationList from "@/consultation/list.vue"
import ChatWindow from "@/consultation/chat_window.vue"
import ConsultationShell from "@/consultation/page_shell.vue"
import registerChatListeners from "@/consultation/listeners/register_chat"
import mergeDeserializedMessages from "@/consultation/helpers/merge_deserialized_messages"
import registerConsultationListeners from "@/consultation/listeners/register_consultation"
import registerChatActivityListeners from "@/consultation/listeners/register_chat_activity"
import makeSwitch from "$@/helpers/make_switch"

Socket.initialize()

const chatMessageActivityFetcher = new ChatMessageActivityFetcher()

const {
	"toggle": toggleConsultationList,
	"state": isConsultationListShown
} = makeSwitch(false)

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

const chatMessageActivityResources = computed<
	DeserializedChatMessageActivityResource<"user"|"consultation">[]
>(() => {
	const foundChatActivity = chatMessageActivities.value.data.filter(activity => {
		const consultationID = activity.consultation.data.id
		return String(consultationID) === String(consultation.value.id)
	}) as DeserializedChatMessageActivityResource<"user"|"consultation">[]

	return foundChatActivity
})

const currentChatMessageActivityResource = computed<
	DeserializedChatMessageActivityResource<"user"|"consultation">
>(() => {
	const foundChatActivity = chatMessageActivityResources.value.find(activity => {
		const ownerID = activity.user.data.id
		return String(ownerID) === String(userProfile.data.id)
	}) as DeserializedChatMessageActivityResource<"user"|"consultation">

	return foundChatActivity
})

provide(CHAT_MESSAGE_ACTIVITY, readonly(currentChatMessageActivityResource))
provide(CHAT_MESSAGE_ACTIVITIES_IN_CONSULTATION, readonly(chatMessageActivityResources))

function updateConsultationAttributes(updatedAttributes: ConsultationAttributes<"deserialized">)
: void {
	consultation.value = {
		...consultation.value,
		...updatedAttributes
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

onMounted(async() => {
	registerChatListeners(
		consultation,
		chatMessages,
		currentChatMessageActivityResource,
		chatMessageActivityFetcher
	)
	registerConsultationListeners(consultation)
	registerChatActivityListeners(consultation, chatMessageActivities)

	await loadConsultations()
	await loadPreviousChatMessages()
})

setInterval(() => {
	ConsultationTimerManager.nextInterval()
}, convertTimeToMilliseconds("00:00:01"))
</script>
