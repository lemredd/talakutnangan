import type { GeneralObject } from "$/types/general"
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

export interface ChatMessageResourceIdentifier<T extends Completeness = "read">
extends ResourceIdentifier<T> {
	type: "chat_message"
}

export interface ChatMessageAttributes<T extends Format = "serialized">
extends Attributes<T> {
	data: GeneralObject
}

export type ChatMessageResource<T extends Completeness = "read"> = Resource<
	T,
	ChatMessageResourceIdentifier<T>,
	ChatMessageAttributes<"serialized">
>

export type DeserializedChatMessageResource = DeserializedResource<
	ChatMessageResourceIdentifier<"read">,
	ChatMessageAttributes<"deserialized">
>

export type ChatMessageDocument<T extends Completeness = "read"> = ResourceDocument<
	T,
	ChatMessageResourceIdentifier<T>,
	ChatMessageAttributes<"serialized">,
	ChatMessageResource<T>
>

export type ChatMessageListDocument<T extends Completeness = "read"> = ResourceListDocument<
	T,
	ChatMessageResourceIdentifier<T>,
	ChatMessageAttributes<"serialized">,
	ChatMessageResource<T>
>

export type DeserializedChatMessageDocument = DeserializedResourceDocument<
	ChatMessageResourceIdentifier<"read">,
	ChatMessageAttributes<"deserialized">,
	DeserializedChatMessageResource
>

export type DeserializedChatMessageListDocument = DeserializedResourceListDocument<
	ChatMessageResourceIdentifier<"read">,
	ChatMessageAttributes<"deserialized">,
	DeserializedChatMessageResource
>
