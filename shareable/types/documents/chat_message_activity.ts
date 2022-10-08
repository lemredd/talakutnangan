import type { UserIdentifierDocument, DeserializedUserDocument } from "$/types/documents/user"
import type {
	ConsultationIdentifierDocument,
	DeserializedConsultationDocument
} from "$/types/documents/consultation"
import type {
	Completeness,
	Format,

	Resource,
	Attributes,
	ResourceIdentifier,
	DeserializedResource,

	DeriveRelationships,
	DeriveRelationshipNames,
	GeneralRelationshipData,
	DeriveDeserializedRelationships,
	PartialOrPickDeserializedRelationship,

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
	receivedMessageAt: (T extends "deserialized" ? Date : string)|null,
	seenMessageAt: (T extends "deserialized" ? Date : string)|null
}

interface ChatMessageActivityRelationshipData<unusedT extends Completeness = "read">
extends GeneralRelationshipData {
	user: {
		serialized: UserIdentifierDocument,
		deserialized: DeserializedUserDocument
	},
	consultation: {
		serialized: ConsultationIdentifierDocument,
		deserialized: DeserializedConsultationDocument
	}
}

export type ChatMessageActivityRelationshipNames
= DeriveRelationshipNames<ChatMessageActivityRelationshipData>

export type ChatMessageActivityRelationships<T extends Completeness = "read">
= DeriveRelationships<ChatMessageActivityRelationshipData<T>>

export type DeserializedChatMessageActivityRelationships<T extends Completeness = "read">
= DeriveDeserializedRelationships<ChatMessageActivityRelationshipData<T>>

export type ChatMessageActivityResource<T extends Completeness = "read"> = Resource<
	T,
	ChatMessageActivityResourceIdentifier<T>,
	ChatMessageActivityAttributes<"serialized">
> & ChatMessageActivityRelationships

export type DeserializedChatMessageActivityResource<
	T extends ChatMessageActivityRelationshipNames|undefined = undefined
> = DeserializedResource<
	ChatMessageActivityResourceIdentifier<"read">,
	ChatMessageActivityAttributes<"deserialized">
> & PartialOrPickDeserializedRelationship<
	ChatMessageActivityRelationshipData<"read">,
	DeserializedChatMessageActivityRelationships<"read">,
	ChatMessageActivityRelationshipNames,
	T extends ChatMessageActivityRelationshipNames ? true : false,
	T extends ChatMessageActivityRelationshipNames ? T : ChatMessageActivityRelationshipNames
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

export type DeserializedChatMessageActivityDocument<
	T extends ChatMessageActivityRelationshipNames|undefined = undefined
> = DeserializedResourceDocument<
	ChatMessageActivityResourceIdentifier<"read">,
	ChatMessageActivityAttributes<"deserialized">,
	DeserializedChatMessageActivityResource<T>
>

export type DeserializedChatMessageActivityListDocument<
	T extends ChatMessageActivityRelationshipNames|undefined = undefined
> = DeserializedResourceListDocument<
	ChatMessageActivityResourceIdentifier<"read">,
	ChatMessageActivityAttributes<"deserialized">,
	DeserializedChatMessageActivityResource<T>
>

export type ChatMessageActivityIdentifierDocument
= IdentifierDocument<ChatMessageActivityResourceIdentifier<"read">>

export type ChatMessageActivityIdentifierListDocument
= IdentifierListDocument<ChatMessageActivityResourceIdentifier<"read">>
