import type { Status } from "$/types/database"
import type { PartialOrPickObject } from "$/types/general"
import type { DeserializedRoleDocument } from "$/types/documents/role"
import type { DeserializedChatMessageListDocument } from "$/types/documents/chat_message"
import type { DeserializedUserDocument, DeserializedUserListDocument } from "$/types/documents/user"
import type {
	DeserializedChatMessageActivityListDocument
} from "$/types/documents/chat_message_activity"
import type {
	Resource,
	Attributes,
	ResourceDocument,
	ResourceIdentifier,
	DeserializedResource,
	ResourceListDocument,
	DeserializedRelationships,
	DeserializedResourceDocument,
	DeserializedResourceListDocument
} from "$/types/documents/base"

export interface ConsultationResourceIdentifier<T extends string|number = string>
extends ResourceIdentifier<T> {
	type: "consultation"
}

export interface ConsultationAttributes extends Attributes {
	reason: string,
	status: Status,
	actionTaken: string,
	scheduledStartDatetim: Date,
	endDatetime: Date
}

export type RawConsultationRelationships<T extends string|number = string> = [
	[ "consultant", DeserializedUserDocument<T> ],
	[ "consultantRole", DeserializedRoleDocument<T> ],
	[ "consulters", DeserializedUserListDocument<T> ],
	[ "chatMessageActivity", DeserializedChatMessageActivityListDocument<T> ],
	[ "chatMessages", DeserializedChatMessageListDocument<T> ]
]

export type ConsultationRelationshipNames = RawConsultationRelationships[number][0]

export type DeserializedConsultationRelationships<T extends string|number = string>
= DeserializedRelationships<T, RawConsultationRelationships<T>>

export type ConsultationResource<T extends string|number = string> = Resource<
	T,
	ConsultationResourceIdentifier<T>,
	ConsultationAttributes
>

export type DeserializedConsultationResource<
	T extends string|number = string,
	U extends ConsultationRelationshipNames|undefined = undefined
> = DeserializedResource<
	T,
	ConsultationResourceIdentifier<T>,
	ConsultationAttributes
> & PartialOrPickObject<
	U,
	ConsultationRelationshipNames,
	DeserializedConsultationRelationships<T>
>

export type ConsultationDocument<T extends string|number = string> = ResourceDocument<
	T,
	ConsultationResourceIdentifier<T>,
	ConsultationAttributes,
	ConsultationResource<T>
>

export type ConsultationListDocument<T extends string|number = string> = ResourceListDocument<
	T,
	ConsultationResourceIdentifier<T>,
	ConsultationAttributes,
	ConsultationResource<T>
>

export type DeserializedConsultationDocument<
	T extends string|number = string,
	U extends ConsultationRelationshipNames|undefined = undefined
> = DeserializedResourceDocument<
	T,
	ConsultationResourceIdentifier<T>,
	ConsultationAttributes,
	DeserializedConsultationResource<T, U>
>

export type DeserializedConsultationListDocument<
	T extends string|number = string,
	U extends ConsultationRelationshipNames|undefined = undefined
> = DeserializedResourceListDocument<
	T,
	ConsultationResourceIdentifier<T>,
	ConsultationAttributes,
	DeserializedConsultationResource<T, U>
>
