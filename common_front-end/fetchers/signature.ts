import type { Serializable } from "$/types/general"
import type { Response } from "$@/types/independent"
import type { CommonQueryParameters } from "$/types/query"
import type {
	SignatureResourceIdentifier,
	SignatureAttributes,
	SignatureResource,
	DeserializedSignatureResource,
	SignatureDocument,
	SignatureListDocument,
	DeserializedSignatureDocument,
	DeserializedSignatureListDocument
} from "$/types/documents/signature"
import { MULTIPART_MEDIA_TYPE } from "$/types/server"

import Fetcher from "$@/fetchers/fetcher"
import specializedPath from "$/helpers/specialize_path"

export default class SignatureFetcher extends Fetcher<
	SignatureResourceIdentifier,
	SignatureAttributes,
	SignatureResource,
	DeserializedSignatureResource,
	SignatureDocument<string>,
	SignatureListDocument,
	DeserializedSignatureDocument,
	DeserializedSignatureListDocument,
	Serializable,
	CommonQueryParameters
> {
	static initialize(basePath: string) {
		super.initialize(basePath, "signature")
	}

	constructor() {
		super(SignatureFetcher.basePath, SignatureFetcher.type)
	}

	async renew(userID: number, details: FormData): Promise<Response<
		SignatureResourceIdentifier,
		SignatureAttributes,
		SignatureResource,
		DeserializedSignatureResource,
		DeserializedSignatureDocument
	>> {
		const pathTemplate = `user/:id/relationships/${this.type}`
		const path = specializedPath(pathTemplate, { "id": userID })
		const headers = this.makeJSONHeaders(MULTIPART_MEDIA_TYPE)

		return await this.handleResponse(
			this.patchThrough(path, details, headers)
		) as Response<
			SignatureResourceIdentifier,
			SignatureAttributes,
			SignatureResource,
			DeserializedSignatureResource,
			DeserializedSignatureDocument
		>
	}
}
