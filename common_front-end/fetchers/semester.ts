import { JSON_API_MEDIA_TYPE } from "$/types/server"
import type { Response } from "$@/types/independent"
import type {
	SemesterResourceIdentifier,
	SemesterAttributes,
	SemesterResource,
	DeserializedSemesterResource,
	SemesterDocument,
	SemesterListDocument,
	DeserializedSemesterDocument,
	DeserializedSemesterListDocument
} from "$/types/documents/semester"

import { SEMESTER_LINK } from "$/constants/template_links"

import BaseFetcher from "$@/fetchers/base"

export default class SemesterFetcher extends BaseFetcher<
	SemesterResourceIdentifier<"read">,
	SemesterAttributes<"serialized">,
	SemesterAttributes<"deserialized">,
	SemesterResource,
	DeserializedSemesterResource,
	SemesterDocument,
	SemesterListDocument,
	DeserializedSemesterDocument,
	DeserializedSemesterListDocument
> {
	constructor() {
		super(SEMESTER_LINK)
	}

	async createWithFile(details: FormData): Promise<Response<
		SemesterResourceIdentifier<"read">,
		SemesterAttributes<"serialized">,
		SemesterAttributes<"deserialized">,
		SemesterResource,
		DeserializedSemesterResource,
		DeserializedSemesterDocument
	>> {
		const headers = new Headers({ "Accept": JSON_API_MEDIA_TYPE })

		return await this.handleResponse(
			this.postTo(this.links.unbound, details, headers)
		) as Response<
			SemesterResourceIdentifier<"read">,
			SemesterAttributes<"serialized">,
			SemesterAttributes<"deserialized">,
			SemesterResource,
			DeserializedSemesterResource,
			DeserializedSemesterDocument
		>
	}
}
