import { Ref } from "vue"

import type { DeserializedConsultationResource } from "$/types/documents/consultation"
import type {
	ChatMessageActivityDocument, DeserializedChatMessageActivityListDocument
} from "$/types/documents/chat_message_activity"

import Socket from "$@/external/socket"
import deserialize from "$/object/deserialize"
import makeConsultationChatActivityNamespace from "$/namespace_makers/consultation_chat_activity"


export default function(
	consultation: Ref<DeserializedConsultationResource<"consultant"|"consultantRole">>,
	chatMessageActivities: Ref<DeserializedChatMessageActivityListDocument<"user"|"consultation">>
) {
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

	const chatActivityNamespace = makeConsultationChatActivityNamespace(consultation.value.id)
	Socket.addEventListeners(chatActivityNamespace, {
		"update": updateMessageActivity
	})
}
