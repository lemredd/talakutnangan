import type {
	Completeness,
	Format,
	Resource,
	Attributes,
	ResourceDocument,
	ResourceIdentifier,
	DeserializedResource,
	ResourceListDocument,
	DeserializedResourceDocument,
	DeserializedResourceListDocument
} from "$/types/documents/base"

export interface ChatMessageActivityResourceIdentifier<T extends Completeness = "read">
extends ResourceIdentifier<T> {
	type: "chat_message_activity"
}

export interface ChatMessageActivityAttributes<T extends Format = "serialized">
extends Attributes<T> {
	receivedMessageAt: string,
	seenMessageAt: string|null
}

export type ChatMessageActivityResource<T extends Completeness = "read"> = Resource<
	T,
	ChatMessageActivityResourceIdentifier<T>,
	ChatMessageActivityAttributes<"serialized">
>

export type DeserializedChatMessageActivityResource = DeserializedResource<
	ChatMessageActivityResourceIdentifier<"read">,
	ChatMessageActivityAttributes<"deserialized">
>

export type ChatMessageActivityDocument<T extends Completeness = "read"> = ResourceDocument<
	T,
	ChatMessageActivityResourceIdentifier<T>,
	ChatMessageActivityAttributes<"serialized">,
	ChatMessageActivityResource<T>
>

export type ChatMessageActivityListDocument<T extends Completeness = "read"> = ResourceListDocument<
	T,
	ChatMessageActivityResourceIdentifier<T>,
	ChatMessageActivityAttributes<"serialized">,
	ChatMessageActivityResource<T>
>

export type DeserializedChatMessageActivityDocument = DeserializedResourceDocument<
	ChatMessageActivityResourceIdentifier<"read">,
	ChatMessageActivityAttributes<"deserialized">,
	DeserializedChatMessageActivityResource
>

export type DeserializedChatMessageActivityListDocument = DeserializedResourceListDocument<
	ChatMessageActivityResourceIdentifier<"read">,
	ChatMessageActivityAttributes<"deserialized">,
	DeserializedChatMessageActivityResource
>
