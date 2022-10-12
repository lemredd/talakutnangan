import { DeserializedChatMessageResource } from "$/types/documents/chat_message"
import type { TextMessage, StatusMessage, FileMessage } from "$/types/message"

export function isMessageKindStatus(value: DeserializedChatMessageResource<"user">)
: value is DeserializedChatMessageResource<"user"> & StatusMessage {
	return value.kind === "status"
}
export function isMessageKindText(value: DeserializedChatMessageResource<"user">)
: value is DeserializedChatMessageResource<"user"> & TextMessage {
	return value.kind === "text"
}
export function isMessageKindFile(value: DeserializedChatMessageResource<"user">)
: value is DeserializedChatMessageResource<"user"> & FileMessage {
	return value.kind === "file"
}
