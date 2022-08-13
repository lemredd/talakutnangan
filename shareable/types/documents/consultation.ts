import type {
	Resource,
	Attributes,
	ResourceDocument,
	ResourceIdentifier,
	DeserializedResource,
	ResourceListDocument,
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

export interface ConsultationResource extends Resource<
	ConsultationResourceIdentifier,
	ConsultationAttributes
> {}

export type DeserializedConsultationResource<T extends string|number = string> = DeserializedResource<
	T,
	ConsultationResourceIdentifier<T>,
	ConsultationAttributes
>

export interface ConsultationDocument extends ResourceDocument<
	ConsultationResourceIdentifier,
	ConsultationAttributes,
	ConsultationResource
> {}

export interface ConsultationListDocument extends ResourceListDocument<
	ConsultationResourceIdentifier,
	ConsultationAttributes,
	ConsultationResource
> {}

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
