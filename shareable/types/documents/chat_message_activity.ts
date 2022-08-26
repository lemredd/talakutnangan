import type { UserIdentifierDocument } from "$/types/documents/user"
import type { ConsultationIdentifierDocument } from "$/types/documents/consultation"
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
	DeserializedResourceListDocument,

	IdentifierDocument,
	IdentifierListDocument
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

export type ChatMessageActivityRelationships = Relationships<{
	"user": UserIdentifierDocument,
	"consultation": ConsultationIdentifierDocument
}>

export type ChatMessageActivityResource<T extends Completeness = "read"> = Resource<
	T,
	ChatMessageActivityResourceIdentifier<T>,
	ChatMessageActivityAttributes<"serialized">
> & ChatMessageActivityRelationships

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

export type ChatMessageActivityIdentifierDocument
= IdentifierDocument<ChatMessageActivityResourceIdentifier<"read">>

export type ChatMessageActivityIdentifierListDocument
= IdentifierListDocument<ChatMessageActivityResourceIdentifier<"read">>
