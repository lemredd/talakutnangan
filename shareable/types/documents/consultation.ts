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

export interface ConsultationResourceIdentifier extends ResourceIdentifier {
	type: "consultation",
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

export interface DeserializedConsultationResource extends DeserializedResource<
	ConsultationResourceIdentifier,
	ConsultationAttributes
> {}

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

export interface DeserializedConsultationDocument extends DeserializedResourceDocument<
	ConsultationResourceIdentifier,
	ConsultationAttributes,
	DeserializedConsultationResource
> {}

export interface DeserializedConsultationListDocument extends DeserializedResourceListDocument<
	ConsultationResourceIdentifier,
	ConsultationAttributes,
	DeserializedConsultationResource
> {}
