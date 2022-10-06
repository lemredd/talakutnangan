import type { ConsultationQueryParameters } from "$/types/query"
import type {
	ConsultationResourceIdentifier,
	ConsultationAttributes,
	ConsultationResource,
	DeserializedConsultationResource,
	ConsultationDocument,
	ConsultationListDocument,
	DeserializedConsultationDocument,
	DeserializedConsultationListDocument
} from "$/types/documents/consultation"

import { CONSULTATION_LINK } from "$/constants/template_links"

import BaseFetcher from "$@/fetchers/base"

export default class ConsultationFetcher extends BaseFetcher<
	ConsultationResourceIdentifier<"read">,
	ConsultationAttributes<"serialized">,
	ConsultationAttributes<"deserialized">,
	ConsultationResource,
	DeserializedConsultationResource,
	ConsultationDocument,
	ConsultationListDocument,
	DeserializedConsultationDocument,
	DeserializedConsultationListDocument,
	{
		"queryParameters": ConsultationQueryParameters
	}
> {
	constructor() {
		super(CONSULTATION_LINK)
	}
}
