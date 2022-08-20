import type { DeserializedRoleDocument } from "$/types/documents/role"
import type { DeserializedChatMessageDocument } from "$/types/documents/chat_message"
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
	status: string,
	actionTaken: string,
	scheduledStartDatetim: Date,
	endDatetime: Date
}

export type RawConsultationRelationships<T extends string|number = string> = [
	[ "consultant", DeserializedUserDocument<T> ],
	[ "consultantRole", DeserializedRoleDocument<T> ],
	[ "consulters", DeserializedUserListDocument<T> ],
	[ "chatMessageActivity", DeserializedChatMessageActivityListDocument<T> ],
	[ "lastChatMessage", DeserializedChatMessageDocument<T> ]
]

export type ConsultationRelationshipNames = RawConsultationRelationships[number][0]

export type DeserializedConsultationRelationships<T extends string|number = string>
= DeserializedRelationships<T, RawConsultationRelationships<T>>

export type ConsultationResource = Resource<
	ConsultationResourceIdentifier,
	ConsultationAttributes
>

export type DeserializedConsultationResource<
	T extends string|number = string,
	U extends ConsultationRelationshipNames|undefined = undefined
> = DeserializedResource<
	T,
	ConsultationResourceIdentifier<T>,
	ConsultationAttributes
> & (
	U extends ConsultationRelationshipNames
	? Pick<DeserializedConsultationRelationships<T>, U>
	: Partial<DeserializedConsultationRelationships<T>>
)

export type ConsultationDocument = ResourceDocument<
	ConsultationResourceIdentifier,
	ConsultationAttributes,
	ConsultationResource
>

export type ConsultationListDocument = ResourceListDocument<
	ConsultationResourceIdentifier,
	ConsultationAttributes,
	ConsultationResource
>

export type DeserializedConsultationDocument<T extends string|number = string>
= DeserializedResourceDocument<
	T,
	ConsultationResourceIdentifier<T>,
	ConsultationAttributes,
	DeserializedConsultationResource<T>
>

export type DeserializedConsultationListDocument<T extends string|number = string>
= DeserializedResourceListDocument<
	T,
	ConsultationResourceIdentifier<T>,
	ConsultationAttributes,
	DeserializedConsultationResource<T>
>
