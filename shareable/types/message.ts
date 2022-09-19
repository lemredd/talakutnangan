import type { Serializable } from "$/types/general"
import type { Format } from "$/types/documents/base"
import type {
	ChatMessageAttributes,
	DeserializedChatMessageRelationships
} from "$/types/documents/chat_message"

/**
 * Shape of text messages.
 */
export interface TextMessage<T extends Format = "serialized"> extends ChatMessageAttributes<T> {
	kind: "text",
	data: {
		value: string
	}
}

/**
 * Shape of text messages.
 */
export interface StatusMessage<T extends Format = "serialized"> extends ChatMessageAttributes<T> {
	kind: "status",
	data: {
		value: string
	}
}

/**
 * Shape of file messages.
 */
export type FileMessage<T extends Format = "serialized"> = ChatMessageAttributes<T> & {
	kind: "file",
	data: {
		subkind: "image"|"video"|"audio"|"unknown"
		name: string
	}
} & (
	T extends "serialized"
		? Serializable
		: Pick<DeserializedChatMessageRelationships<"read">, "attachedChatFile">
)

/**
 * Union of all kinds of messages.
 */
export type Message<T extends Format = "serialized"> =
	| TextMessage<T>
	| StatusMessage<T>
	| FileMessage<T>
