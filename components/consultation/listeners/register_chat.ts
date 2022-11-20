import { ComputedRef, Ref } from "vue"

import type { DeserializedConsultationResource } from "$/types/documents/consultation"
import type { DeserializedProfilePictureDocument } from "$/types/documents/profile_picture"
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
import WindowFocus from "$@/external/window_focus"
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
	currentConsultationActivities: ComputedRef<
		DeserializedChatMessageActivityResource<"user"|"consultation">[]
	>,
	chatMessageActivityFetcher: ChatMessageActivityFetcher
) {
	let isWindowShown = false
	function updateReceivedMessageAt(): void {
		const lastSeenMessageAt = currentChatMessageActivityResource.value.seenMessageAt
		chatMessageActivityFetcher.update(currentChatMessageActivityResource.value.id, {
			"receivedMessageAt": new Date().toJSON(),
			"seenMessageAt": isWindowShown
				? new Date().toJSON()
				: lastSeenMessageAt?.toJSON() ?? null
		})
	}

	function updateSeenMessageAt(): void {
		const { receivedMessageAt } = currentChatMessageActivityResource.value
		chatMessageActivityFetcher.update(currentChatMessageActivityResource.value.id, {
			"receivedMessageAt": receivedMessageAt?.toJSON() ?? new Date().toJSON(),
			"seenMessageAt": new Date().toJSON()
		})
	}

	WindowFocus.addEventListener(newState => {
		const isWindowFocused = newState === "focus"

		if (isWindowFocused) updateSeenMessageAt()
	})
	DocumentVisibility.addEventListener(newState => {
		isWindowShown = newState === "visible"

		if (isWindowShown) updateSeenMessageAt()
	})

	const debounceUpdateReceivedMessageAt = debounce(() => {
		if (isWindowShown) updateReceivedMessageAt()
	}, DEBOUNCED_WAIT_DURATION)

	function createMessage(message: ChatMessageDocument<"read">): void {
		const deserializedMessage = deserialize(message) as DeserializedChatMessageDocument<"user">
		const { "id": userIDFromDeserializedMessage } = deserializedMessage.data.user.data
		const [ matchingChatMessageActivity ] = currentConsultationActivities.value.filter(
			activity => activity.user.data.id === userIDFromDeserializedMessage
		)

		deserializedMessage.data.user.data.profilePicture
		= matchingChatMessageActivity.user.data.profilePicture as DeserializedProfilePictureDocument
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
