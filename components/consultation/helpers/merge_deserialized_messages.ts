import { Ref } from "vue"

import type {
	DeserializedChatMessageListDocument,
	DeserializedChatMessageResource
} from "$/types/documents/chat_message"

import calculateMillisecondDifference from "$/time/calculate_millisecond_difference"

export default function(
	chatMessages: Ref<DeserializedChatMessageListDocument<"user">>,
	messages: DeserializedChatMessageResource<"user">[]
): void {
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
