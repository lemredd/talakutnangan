import { ComputedRef, Ref } from "vue"

import type { DeserializedConsultationResource } from "$/types/documents/consultation"
import type {
	DeserializedChatMessageActivityResource
} from "$/types/documents/chat_message_activity"
import type {
	ChatMessageDocument,
	DeserializedChatMessageDocument,
	DeserializedChatMessageListDocument
} from "$/types/documents/chat_message"

import { DEBOUNCED_WAIT_DURATION } from "$@/constants/time"

import mergeDeserializedMessages from "@/consultation/helpers/merge_deserialized_messages"

import Socket from "$@/external/socket"
import debounce from "$@/helpers/debounce"
import deserialize from "$/object/deserialize"
import DocumentVisibility from "$@/external/document_visibility"
import ChatMessageActivityFetcher from "$@/fetchers/chat_message_activity"
import ConsultationTimerManager from "$@/helpers/consultation_timer_manager"
import makeConsultationChatNamespace from "$/namespace_makers/consultation_chat"


export default function(
	consultation: Ref<DeserializedConsultationResource<"consultant"|"consultantRole">>,
	chatMessages: Ref<DeserializedChatMessageListDocument<"user">>,
	currentChatMessageActivityResource: ComputedRef<
		DeserializedChatMessageActivityResource<"user"|"consultation">
	>,
	chatMessageActivityFetcher: ChatMessageActivityFetcher
) {
	let isWindowShown = false
	function updateReceivedMessageAt(): void {
		const lastSeenMessageAt = currentChatMessageActivityResource.value.seenMessageAt
		chatMessageActivityFetcher.update(currentChatMessageActivityResource.value.id, {
			"receivedMessageAt": new Date().toJSON(),
			"seenMessageAt": lastSeenMessageAt?.toJSON() ?? null
		})
	}

	DocumentVisibility.addEventListener(newState => {
		isWindowShown = newState === "visible"
	})

	const debounceUpdateReceivedMessageAt = debounce(() => {
		if (isWindowShown) updateReceivedMessageAt()
	}, DEBOUNCED_WAIT_DURATION)

	function createMessage(message: ChatMessageDocument<"read">): void {
		const deserializedMessage = deserialize(message) as DeserializedChatMessageDocument<"user">
		mergeDeserializedMessages(chatMessages, [ deserializedMessage.data ])

		ConsultationTimerManager.restartTimerFor(consultation.value)
		debounceUpdateReceivedMessageAt()
	}

	function updateMessage(message: ChatMessageDocument<"read">): void {
		const IDOfMessageToRemove = message.data.id
		chatMessages.value.data = chatMessages.value.data.filter(
			chatMessage => chatMessage.id !== IDOfMessageToRemove
		)

		createMessage(message)
	}


	const chatNamespace = makeConsultationChatNamespace(consultation.value.id)
	Socket.addEventListeners(chatNamespace, {
		"connect_error": () => alert("cannot connect to server"),
		"create": createMessage,
		"update": updateMessage
	})
}
