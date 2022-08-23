import type { Serializable } from "$/types/general"
import type { CommonQueryParameters } from "$/types/query"
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
import BaseFetcher from "$@/fetchers/base"

export default class ConsultationFetcher extends BaseFetcher<
	ConsultationResourceIdentifier,
	ConsultationAttributes,
	ConsultationResource,
	DeserializedConsultationResource,
	ConsultationDocument,
	ConsultationListDocument,
	DeserializedConsultationDocument,
	DeserializedConsultationListDocument,
	Serializable,
	CommonQueryParameters
> {
	static initialize(basePath: string) {
		super.initialize(basePath, "consultation")
	}

	constructor() {
		super(ConsultationFetcher.basePath, ConsultationFetcher.type)
	}
}
