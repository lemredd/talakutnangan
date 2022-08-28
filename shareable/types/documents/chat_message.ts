import type { Serializable, PartialOrPickObject } from "$/types/general"
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

	Relationships,
	DeserializedRelationships,
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

type RawDeserializedChatMessageRelationships = [
	[ "user", DeserializedUserDocument ],
	[ "consultation", DeserializedConsultationDocument ],
	[ "chatMessageActivity", DeserializedChatMessageActivityDocument ]
]

export type DeserializedChatMessageRelationships = DeserializedRelationships & {
	[Property in RawDeserializedChatMessageRelationships[number][0]]
	: RawDeserializedChatMessageRelationships[number][1]
}

export type ChatMessageRelationshipNames
= RawDeserializedChatMessageRelationships[number][0]

export type DeserializedChatMessageResource<
	T extends ChatMessageRelationshipNames|undefined = undefined
> = DeserializedResource<
	ChatMessageResourceIdentifier<"read">,
	ChatMessageAttributes<"deserialized">
> & PartialOrPickObject<
	T,
	ChatMessageRelationshipNames,
	DeserializedChatMessageRelationships
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
