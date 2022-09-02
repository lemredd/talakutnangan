import type { Serializable } from "$/types/general"
import type {
	RoleIdentifierDocument,
	DeserializedRoleDocument
} from "$/types/documents/role"
import type {
	ChatMessageIdentifierListDocument,
	DeserializedChatMessageListDocument
} from "$/types/documents/chat_message"
import type {
	ChatMessageActivityIdentifierListDocument,
	DeserializedChatMessageActivityListDocument
} from "$/types/documents/chat_message_activity"
import type {
	UserIdentifierDocument,
	UserIdentifierListDocument,
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
	PartialOrPickDeserializedRelationship,

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
	finishedAt: (T extends "serialized" ? string : Date)|null,
	deletedAt: (T extends "serialized" ? string : Date)|null
}

interface ConsultationRelationshipData<T extends Completeness = "read">
extends GeneralRelationshipData {
	consultant: {
		serialized: UserIdentifierDocument,
		deserialized: DeserializedUserDocument
	},
	consultantRole: {
		serialized: RoleIdentifierDocument<T extends "create"|"update" ? "attached" : T>,
		deserialized: DeserializedRoleDocument
	},
	consulters: {
		serialized: UserIdentifierListDocument,
		deserialized: DeserializedUserListDocument
	},
	chatMessageActivities: {
		serialized: T extends "create" ? undefined : ChatMessageActivityIdentifierListDocument,
		deserialized: DeserializedChatMessageActivityListDocument
	},
	chatMessages: {
		serialized: T extends "create" ? undefined : ChatMessageIdentifierListDocument,
		deserialized: DeserializedChatMessageListDocument
	}
}

export type ConsultationRelationshipNames = DeriveRelationshipNames<ConsultationRelationshipData>

export type ConsultationRelationships<T extends Completeness = "read">
= DeriveRelationships<ConsultationRelationshipData<T>>

export type DeserializedConsultationRelationships<T extends Completeness = "read">
= DeriveDeserializedRelationships<ConsultationRelationshipData<T>>

export type ConsultationResource<T extends Completeness = "read">
= Resource<
	T,
	ConsultationResourceIdentifier<T>,
	ConsultationAttributes
> & (
	T extends "create"
		? ConsultationRelationships<T>
		: Serializable
)

export type DeserializedConsultationResource<
	T extends ConsultationRelationshipNames|undefined = undefined
> = DeserializedResource<
	ConsultationResourceIdentifier<"read">,
	ConsultationAttributes<"deserialized">
>& PartialOrPickDeserializedRelationship<
	ConsultationRelationshipData<"read">,
	DeserializedConsultationRelationships<"read">,
	ConsultationRelationshipNames,
	T extends ConsultationRelationshipNames ? true : false,
	T extends ConsultationRelationshipNames ? T : ConsultationRelationshipNames
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
