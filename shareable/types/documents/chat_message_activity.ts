import type {
	Resource,
	Attributes,
	ResourceDocument,
	ResourceIdentifier,
	DeserializedResource,
	ResourceListDocument,
	DeserializedResourceDocument,
	DeserializedResourceListDocument
} from "$/types/documents/base"

export interface ChatMessageActivityResourceIdentifier<T extends string|number = string>
extends ResourceIdentifier<T> {
	type: "chat_message_activity"
}

export interface ChatMessageActivityAttributes extends Attributes {
	receivedMessageAt: string,
	seenMessageAt: string|null
}

export type ChatMessageActivityResource = Resource<
	ChatMessageActivityResourceIdentifier,
	ChatMessageActivityAttributes
>

export type DeserializedChatMessageActivityResource<T extends string|number = string>
= DeserializedResource<
	T,
	ChatMessageActivityResourceIdentifier<T>,
	ChatMessageActivityAttributes
>

export type ChatMessageActivityDocument = ResourceDocument<
	ChatMessageActivityResourceIdentifier,
	ChatMessageActivityAttributes,
	ChatMessageActivityResource
>

export type ChatMessageActivityListDocument = ResourceListDocument<
	ChatMessageActivityResourceIdentifier,
	ChatMessageActivityAttributes,
	ChatMessageActivityResource
>

export type DeserializedChatMessageActivityDocument<T extends string|number = string>
= DeserializedResourceDocument<
	T,
	ChatMessageActivityResourceIdentifier<T>,
	ChatMessageActivityAttributes,
	DeserializedChatMessageActivityResource<T>
>

export type DeserializedChatMessageActivityListDocument<T extends string|number = string>
= DeserializedResourceListDocument<
	T,
	ChatMessageActivityResourceIdentifier<T>,
	ChatMessageActivityAttributes,
	DeserializedChatMessageActivityResource<T>
>
