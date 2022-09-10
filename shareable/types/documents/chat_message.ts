import type { Serializable } from "$/types/general"
import type { UserIdentifierDocument, DeserializedUserDocument } from "$/types/documents/user"
import type {
	ChatMessageActivityIdentifierDocument,
	DeserializedChatMessageActivityDocument
} from "$/types/documents/chat_message_activity"
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

interface ChatMessageRelationshipData
extends GeneralRelationshipData {
	user: {
		serialized: UserIdentifierDocument,
		deserialized: DeserializedUserDocument
	},
	consultation: {
		serialized: ConsultationIdentifierDocument,
		deserialized: DeserializedConsultationDocument
	},
	chatMessageActivity: {
		serialized: ChatMessageActivityIdentifierDocument,
		deserialized: DeserializedChatMessageActivityDocument
	}
}

export type ChatMessageRelationshipNames = DeriveRelationshipNames<ChatMessageRelationshipData>

export type ChatMessageRelationship
= DeriveRelationships<ChatMessageRelationshipData>

export type DeserializedChatMessageRelationship
= DeriveDeserializedRelationships<ChatMessageRelationshipData>

export type ChatMessageResource<T extends Completeness = "read"> = Resource<
	T,
	ChatMessageResourceIdentifier<T>,
	ChatMessageAttributes<"serialized">
> & (
	T extends "create" ? ChatMessageRelationship : Serializable
)

export type DeserializedChatMessageResource<
	T extends ChatMessageRelationshipNames|undefined = undefined
> = DeserializedResource<
	ChatMessageResourceIdentifier<"read">,
	ChatMessageAttributes<"deserialized">
> & PartialOrPickDeserializedRelationship<
	ChatMessageRelationshipData,
	DeserializedChatMessageRelationship,
	ChatMessageRelationshipNames,
	T extends ChatMessageRelationshipNames ? true : false,
	T extends ChatMessageRelationshipNames ? T : ChatMessageRelationshipNames
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

export type DeserializedChatMessageDocument<
	T extends ChatMessageRelationshipNames|undefined = undefined
> = DeserializedResourceDocument<
	ChatMessageResourceIdentifier<"read">,
	ChatMessageAttributes<"deserialized">,
	DeserializedChatMessageResource<T>
>

export type DeserializedChatMessageListDocument<
	T extends ChatMessageRelationshipNames|undefined = undefined
> = DeserializedResourceListDocument<
	ChatMessageResourceIdentifier<"read">,
	ChatMessageAttributes<"deserialized">,
	DeserializedChatMessageResource<T>
>

export type ChatMessageIdentifierDocument
= IdentifierDocument<ChatMessageResourceIdentifier<"read">>

export type ChatMessageIdentifierListDocument
= IdentifierListDocument<ChatMessageResourceIdentifier<"read">>
