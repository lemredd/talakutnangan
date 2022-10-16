import type { Response } from "$@/types/independent"
import type { ConsultationQueryParameters } from "$/types/query"
import type { AsynchronousFileDocument } from "$/types/documents/asynchronous_file"
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
import specializePath from "$/helpers/specialize_path"

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

	requestAsPDF(id: string): Promise<Response<
		ConsultationResourceIdentifier,
		ConsultationAttributes<"serialized">,
		ConsultationAttributes<"deserialized">,
		ConsultationResource,
		DeserializedConsultationResource,
		AsynchronousFileDocument<"read", "deserialized">
	>> {
		return this.handleResponse(
			this.postJSON(specializePath(`${this.links.bound}/request/as_pdf`, { id }), {}),
			true
		) as Promise<Response<
			ConsultationResourceIdentifier,
			ConsultationAttributes<"serialized">,
			ConsultationAttributes<"deserialized">,
			ConsultationResource,
			DeserializedConsultationResource,
			AsynchronousFileDocument<"read", "deserialized">
		>>
	}
}
