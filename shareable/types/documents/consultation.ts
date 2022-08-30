import type { Status } from "$/types/database"
import type { PartialOrPickObject } from "$/types/general"
import type { DeserializedRoleDocument } from "$/types/documents/role"
import type { DeserializedChatMessageListDocument } from "$/types/documents/chat_message"
import type { DeserializedUserDocument, DeserializedUserListDocument } from "$/types/documents/user"
import type {
	DeserializedChatMessageActivityListDocument
} from "$/types/documents/chat_message_activity"
import type {
	Completeness,
	Format,

	Resource,
	Attributes,
	ResourceIdentifier,
	DeserializedResource,

	ResourceDocument,
	ResourceListDocument,
	DeserializedRelationships,
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
	status: T extends "serialized" ? string : Status,
	actionTaken: string,
	scheduledStartAt: T extends "serialized" ? string : Date,
	startedAt: (T extends "serialized" ? string : Date)|null,
	finishedAt: (T extends "serialized" ? string : Date)|null
}

type RawDeserializedConsultationRelationships = [
	[ "consultant", DeserializedUserDocument ],
	[ "consultantRole", DeserializedRoleDocument ],
	[ "consulters", DeserializedUserListDocument ],
	[ "chatMessageActivities", DeserializedChatMessageActivityListDocument ],
	[ "chatMessages", DeserializedChatMessageListDocument ]
]

export type DeserializedConsultationRelationships = DeserializedRelationships & {
	[Property in RawDeserializedConsultationRelationships[number][0]]
	: RawDeserializedConsultationRelationships[number][1]
}

export type ConsultationRelationshipNames = RawDeserializedConsultationRelationships[number][0]

export type ConsultationResource<T extends Completeness = "read"> = Resource<
	T,
	ConsultationResourceIdentifier<T>,
	ConsultationAttributes<"serialized">
>

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
