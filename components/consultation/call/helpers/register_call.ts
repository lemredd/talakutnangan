import { ComputedRef, Ref } from "vue"

import type { DeserializedConsultationResource } from "$/types/documents/consultation"
import type {
	DeserializedChatMessageActivityResource
} from "$/types/documents/chat_message_activity"

import Socket from "$@/external/socket"

import ChatMessageActivityFetcher from "$@/fetchers/chat_message_activity"
import makeConsultationCallNamespace from "$/namespace_makers/consultation_call"

export default function(
	consultation: Ref<DeserializedConsultationResource<"consultant"|"consultantRole">>,
	currentChatMessageActivityResource: ComputedRef<
		DeserializedChatMessageActivityResource<"user"|"consultation">
	>,
	chatMessageActivityFetcher: ChatMessageActivityFetcher
) {
	let isWindowShown = false

	function updateSeenMessageAt(): void {
		const { receivedMessageAt } = currentChatMessageActivityResource.value
		chatMessageActivityFetcher.update(currentChatMessageActivityResource.value.id, {
			"receivedMessageAt": receivedMessageAt?.toJSON() ?? new Date().toJSON(),
			"seenMessageAt": new Date().toJSON()
		})
	}

	const callNamespace = makeConsultationCallNamespace(consultation.value.id)
	Socket.addEventListeners(callNamespace, {
		"connect_error": () => alert("cannot connect to server"),
		"create": ,
		"update": () => null
	})
}
