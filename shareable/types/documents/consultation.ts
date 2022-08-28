import type { Serializable, PartialOrPickObject } from "$/types/general"
import type {
	RoleDocument,
	DeserializedRoleDocument
} from "$/types/documents/role"
import type {
	ChatMessageListDocument,
	DeserializedChatMessageListDocument
} from "$/types/documents/chat_message"
import type {
	ChatMessageActivityListDocument,
	DeserializedChatMessageActivityListDocument
} from "$/types/documents/chat_message_activity"
import type {
	UserDocument,
	UserListDocument,
	DeserializedUserDocument,
	DeserializedUserListDocument
} from "$/types/documents/user"
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

	ResourceDocument,
	ResourceListDocument,
	DeserializedResourceDocument,
	DeserializedResourceListDocument,

	IdentifierDocument,
	IdentifierListDocument
} from "$/types/documents/base"

export interface ConsultationResourceIdentifier<T extends Completeness = "read">
extends ResourceIdentifier<T> {
	type: "consultation"
}

export interface ConsultationAttributes<T extends Format = "serialized">
extends Attributes<T> {
	reason: string,
	actionTaken: string|null,
	scheduledStartAt: T extends "serialized" ? string : Date,
	startedAt: (T extends "serialized" ? string : Date)|null,
	finishedAt: (T extends "serialized" ? string : Date)|null
}

interface ConsultationRelationshipData extends GeneralRelationshipData {
	consultant: {
		serialized: UserDocument,
		deserialized: DeserializedUserDocument
	},
	consultantRole: {
		serialized: RoleDocument,
		deserialized: DeserializedRoleDocument
	},
	consulters: {
		serialized: UserListDocument,
		deserialized: DeserializedUserListDocument
	},
	chatMessageActivity: {
		serialized: ChatMessageActivityListDocument,
		deserialized: DeserializedChatMessageActivityListDocument
	},
	chatMessages: {
		serialized: ChatMessageListDocument,
		deserialized: DeserializedChatMessageListDocument
	}
}

export type ConsultationRelationshipNames = DeriveRelationshipNames<ConsultationRelationshipData>

export type ConsultationRelationships = DeriveRelationships<ConsultationRelationshipData>

export type DeserializedConsultationRelationships
= DeriveDeserializedRelationships<ConsultationRelationshipData>

export type ConsultationResource<T extends Completeness = "read"> = Resource<
	T,
	ConsultationResourceIdentifier<T>,
	ConsultationAttributes<"serialized">
> & (
	T extends "create" ? ConsultationRelationships : Serializable
)

export type DeserializedConsultationResource<
	T extends ConsultationRelationshipNames|undefined = undefined
> = DeserializedResource<
	ConsultationResourceIdentifier<"read">,
	ConsultationAttributes<"deserialized">
> & PartialOrPickObject<
	T,
	ConsultationRelationshipNames,
	DeserializedConsultationRelationships
>

export type ConsultationDocument<T extends Completeness = "read"> = ResourceDocument<
	T,
	ConsultationResourceIdentifier<T>,
	ConsultationAttributes,
	ConsultationResource<T>
>

export type ConsultationListDocument<T extends Completeness = "read"> = ResourceListDocument<
	T,
	ConsultationResourceIdentifier<T>,
	ConsultationAttributes,
	ConsultationResource<T>
>

export type DeserializedConsultationDocument<
	T extends ConsultationRelationshipNames|undefined = undefined
> = DeserializedResourceDocument<
	ConsultationResourceIdentifier<"read">,
	ConsultationAttributes<"deserialized">,
	DeserializedConsultationResource<T>
>

export type DeserializedConsultationListDocument<
	T extends ConsultationRelationshipNames|undefined = undefined
> = DeserializedResourceListDocument<
	ConsultationResourceIdentifier<"read">,
	ConsultationAttributes<"deserialized">,
	DeserializedConsultationResource<T>
>

export type ConsultationIdentifierDocument
= IdentifierDocument<ConsultationResourceIdentifier<"read">>

export type ConsultationIdentifierListDocument
= IdentifierListDocument<ConsultationResourceIdentifier<"read">>
