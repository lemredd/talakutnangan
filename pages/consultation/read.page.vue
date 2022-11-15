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
				:has-loaded-chat-messages="hasLoadedChatMessages"
				:is-consultation-list-shown="isConsultationListShown"
				@updated-consultation-attributes="updateConsultationAttributes"
				@toggle-consultation-list="toggleConsultationList"
				@load-previous-messages="loadPreviousChatMessages"/>
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
import { provide, inject, ref, readonly, computed, onMounted, Ref } from "vue"

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

import { DEFAULT_LIST_LIMIT } from "$/constants/numerical"

import Socket from "$@/external/socket"
import ChatMessageFetcher from "$@/fetchers/chat_message"
import ConsultationFetcher from "$@/fetchers/consultation"

import makeSwitch from "$@/helpers/make_switch"
import isUndefined from "$/type_guards/is_undefined"
import loadRemainingResource from "$@/helpers/load_remaining_resource"
import ChatMessageActivityFetcher from "$@/fetchers/chat_message_activity"
import convertTimeToMilliseconds from "$/time/convert_time_to_milliseconds"
import ConsultationTimerManager from "$@/helpers/consultation_timer_manager"

import ConsultationList from "@/consultation/list.vue"
import ChatWindow from "@/consultation/chat_window.vue"
import ConsultationShell from "@/consultation/page_shell.vue"
import registerChatListeners from "@/consultation/listeners/register_chat"
import registerConsultationListeners from "@/consultation/listeners/register_consultation"
import registerChatActivityListeners from "@/consultation/listeners/register_chat_activity"

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

const currentConsultationActivity = computed<
	DeserializedChatMessageActivityResource<"user"|"consultation">[]
>(() => {
	const foundChatActivity = chatMessageActivities.value.data.filter(activity => {
		const consultationID = activity.consultation.data.id
		return String(consultationID) === String(consultation.value.id)
	}) as DeserializedChatMessageActivityResource<"user"|"consultation">[]

	return foundChatActivity
})

const ownCurrentConsultationActivityResource = computed<
	DeserializedChatMessageActivityResource<"user"|"consultation">
>(() => {
	const foundChatActivity = currentConsultationActivity.value.find(activity => {
		const ownerID = activity.user.data.id
		return String(ownerID) === String(userProfile.data.id)
	})

	if (isUndefined(foundChatActivity)) {
		throw new Error("Chat message activity of the current user was not found.")
	}

	return foundChatActivity
})

provide(CHAT_MESSAGE_ACTIVITY, readonly(ownCurrentConsultationActivityResource))
provide(CHAT_MESSAGE_ACTIVITIES_IN_CONSULTATION, readonly(currentConsultationActivity))

function updateConsultationAttributes(updatedAttributes: ConsultationAttributes<"deserialized">)
: void {
	consultation.value = {
		...consultation.value,
		...updatedAttributes
	}
}

const chatMessageFetcher = new ChatMessageFetcher()
const hasLoadedChatMessages = ref<boolean>(true)
async function loadPreviousChatMessages(): Promise<void> {
	hasLoadedChatMessages.value = false
	await loadRemainingResource(
		chatMessages as Ref<DeserializedChatMessageListDocument>,
		chatMessageFetcher,
		() => ({
			"filter": {
				"chatMessageKinds": [ "text", "status" ],
				"consultationIDs": [ consultation.value.id ],
				"existence": "exists",
				"previewMessageOnly": false
			},
			"page": {
				"limit": DEFAULT_LIST_LIMIT,
				"offset": chatMessages.value.data.length
			},
			"sort": [ "-createdAt" ]
		}),
		{
			"mayContinue": () => Promise.resolve(false)
		}
	)
	hasLoadedChatMessages.value = true
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
			"limit": DEFAULT_LIST_LIMIT,
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
			"limit": DEFAULT_LIST_LIMIT,
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
		const consultationIDs = castData.map(resource => resource.id)

		if (consultationIDs.length) await loadPreviewMessages(consultationIDs)
	}
}

onMounted(async() => {
	registerChatListeners(
		consultation,
		chatMessages,
		ownCurrentConsultationActivityResource,
		chatMessageActivityFetcher
	)
	registerConsultationListeners(consultation, consultations, userProfile.data.id)
	registerChatActivityListeners(consultation, chatMessageActivities)

	await loadConsultations()
})

setInterval(() => {
	ConsultationTimerManager.nextInterval()
}, convertTimeToMilliseconds("00:00:01"))
</script>
