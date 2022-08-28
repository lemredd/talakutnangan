import type { Serializable } from "$/types/general"
import type { UserIdentifierDocument } from "$/types/documents/user"
import type { ConsultationIdentifierDocument } from "$/types/documents/consultation"
import type { ChatMessageActivityIdentifierDocument } from "$/types/documents/chat_message_activity"
import type {
	Completeness,
	Format,

	Relationships,
	Resource,
	Attributes,
	ResourceIdentifier,
	DeserializedResource,

	ResourceDocument,
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
	kind: string,
	data: Serializable,
	createdAt: T extends "deserialized" ? Date : string
	updatedAt: T extends "deserialized" ? Date : string
}

export type ChatMessageRelationships = Relationships<{
	"user": UserIdentifierDocument,
	"consultation": ConsultationIdentifierDocument,
	"chatMessageActivity": ChatMessageActivityIdentifierDocument
}>

export type ChatMessageResource<T extends Completeness = "read"> = Resource<
	T,
	ChatMessageResourceIdentifier<T>,
	ChatMessageAttributes<"serialized">
> & (
	T extends "create" ? ChatMessageRelationships : Serializable
)

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
