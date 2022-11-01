import { ComputedRef, Ref } from "vue"

import type { DeserializedConsultationResource } from "$/types/documents/consultation"
import type {
	ChatMessageActivityResourceIdentifier,
	DeserializedChatMessageActivityResource
} from "$/types/documents/chat_message_activity"

import Socket from "$@/external/socket"

import isUndefined from "$/type_guards/is_undefined"
import makeConsultationCallNamespace from "$/namespace_makers/consultation_call"

export default function(
	consultation: Ref<DeserializedConsultationResource<"consultant"|"consultantRole">>,
	receivedPeerIDs: Ref<ChatMessageActivityResourceIdentifier[]>
) {

	function receivePeerID(resource: ChatMessageActivityResourceIdentifier) {
		if (isUndefined(resource.meta)) {
			throw new Error("Developer forgot to send the ID")
		}

		const index = receivedPeerIDs.value.findIndex(peerID => peerID.id === resource.id)
		let confirmedResource = resource

		if (index > -1) {
			confirmedResource = receivedPeerIDs.value.splice(
				index,
				1
			)[0] as ChatMessageActivityResourceIdentifier
			confirmedResource.meta = resource.meta
		}

		receivedPeerIDs.value = [
			...receivedPeerIDs.value,
			confirmedResource
		]
	}

	const callNamespace = makeConsultationCallNamespace(consultation.value.id)
	Socket.addEventListeners(callNamespace, {
		"connect_error": () => alert("cannot connect to server"),
		"receive_peer_id": receivePeerID,
		"update": () => null
	})
}
