import type { GeneralObject } from "$/types/general"
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

export interface ChatMessageResourceIdentifier<T extends string|number = string>
extends ResourceIdentifier<T> {
	type: "chat_message"
}

export interface ChatMessageAttributes extends Attributes {
	data: GeneralObject
}

export type ChatMessageResource = Resource<
	ChatMessageResourceIdentifier,
	ChatMessageAttributes
>

export type DeserializedChatMessageResource<T extends string|number = string>
= DeserializedResource<
	T,
	ChatMessageResourceIdentifier<T>,
	ChatMessageAttributes
>

export type ChatMessageDocument = ResourceDocument<
	ChatMessageResourceIdentifier,
	ChatMessageAttributes,
	ChatMessageResource
>

export type ChatMessageListDocument = ResourceListDocument<
	ChatMessageResourceIdentifier,
	ChatMessageAttributes,
	ChatMessageResource
>

export type DeserializedChatMessageDocument<T extends string|number = string>
= DeserializedResourceDocument<
	T,
	ChatMessageResourceIdentifier<T>,
	ChatMessageAttributes,
	DeserializedChatMessageResource<T>
>

export type DeserializedChatMessageListDocument<T extends string|number = string>
= DeserializedResourceListDocument<
	T,
	ChatMessageResourceIdentifier<T>,
	ChatMessageAttributes,
	DeserializedChatMessageResource<T>
>
