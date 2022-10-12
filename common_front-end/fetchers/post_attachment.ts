import { JSON_API_MEDIA_TYPE } from "$/types/server"
import type { Response } from "$@/types/independent"
import type {
	PostAttachmentResourceIdentifier,
	PostAttachmentAttributes,
	PostAttachmentResource,
	DeserializedPostAttachmentResource,
	PostAttachmentDocument,
	PostAttachmentListDocument,
	DeserializedPostAttachmentDocument,
	DeserializedPostAttachmentListDocument
} from "$/types/documents/post_attachment"

import { POST_ATTACHMENT_LINK } from "$/constants/template_links"

import BaseFetcher from "$@/fetchers/base"

export default class PostAttachmentAttachmentFetcher extends BaseFetcher<
	PostAttachmentResourceIdentifier<"read">,
	PostAttachmentAttributes<"serialized">,
	PostAttachmentAttributes<"deserialized">,
	PostAttachmentResource,
	DeserializedPostAttachmentResource,
	PostAttachmentDocument,
	PostAttachmentListDocument,
	DeserializedPostAttachmentDocument,
	DeserializedPostAttachmentListDocument
> {
	constructor() {
		super(POST_ATTACHMENT_LINK)
	}

	async createWithFile(details: FormData): Promise<Response<
		PostAttachmentResourceIdentifier<"read">,
		PostAttachmentAttributes<"serialized">,
		PostAttachmentAttributes<"deserialized">,
		PostAttachmentResource,
		DeserializedPostAttachmentResource,
		DeserializedPostAttachmentDocument
	>> {
		const headers = new Headers({ "Accept": JSON_API_MEDIA_TYPE })

		return await this.handleResponse(
			this.postTo(this.links.unbound, details, headers)
		) as Response<
			PostAttachmentResourceIdentifier<"read">,
			PostAttachmentAttributes<"serialized">,
			PostAttachmentAttributes<"deserialized">,
			PostAttachmentResource,
			DeserializedPostAttachmentResource,
			DeserializedPostAttachmentDocument
		>
	}
}
