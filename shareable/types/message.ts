import type { Format } from "$/types/documents/base"
import type { ChatMessageAttributes } from "$/types/documents/chat_message"
import type { DeserializedAttachedChatFileDocument } from "$/types/documents/attached_chat_file"

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
export interface FileMessage<T extends Format = "serialized"> extends ChatMessageAttributes<T> {
	kind: "file",
	data: {
		subkind: "image"|"video"|"audio"|"unknown"
		name: string
	}
}

/**
 * Union of all kinds of messages.
 */
export type Message<T extends Format = "serialized"> =
	| TextMessage<T>
	| StatusMessage<T>
	| FileMessage<T>
