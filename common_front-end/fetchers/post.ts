import { JSON_API_MEDIA_TYPE } from "$/types/server"
import type { Response } from "$@/types/independent"
import type { PostQueryParameters } from "$/types/query"
import type {
	PostResourceIdentifier,
	PostAttributes,
	PostResource,
	DeserializedPostResource,
	PostDocument,
	PostListDocument,
	DeserializedPostDocument,
	DeserializedPostListDocument
} from "$/types/documents/post"

import { POST_LINK } from "$/constants/template_links"

import BaseFetcher from "$@/fetchers/base"

export default class PostFetcher extends BaseFetcher<
	PostResourceIdentifier<"read">,
	PostAttributes<"serialized">,
	PostAttributes<"deserialized">,
	PostResource,
	DeserializedPostResource,
	PostDocument,
	PostListDocument,
	DeserializedPostDocument,
	DeserializedPostListDocument,
	{
		"queryParameters": PostQueryParameters<string>
	}
> {
	constructor() {
		super(POST_LINK)
	}

	async createWithFile(details: FormData): Promise<Response<
		PostResourceIdentifier<"read">,
		PostAttributes<"serialized">,
		PostAttributes<"deserialized">,
		PostResource,
		DeserializedPostResource,
		DeserializedPostDocument
	>> {
		const headers = new Headers({ "Accept": JSON_API_MEDIA_TYPE })

		return await this.handleResponse(
			this.postTo(this.links.unbound, details, headers)
		) as Response<
			PostResourceIdentifier<"read">,
			PostAttributes<"serialized">,
			PostAttributes<"deserialized">,
			PostResource,
			DeserializedPostResource,
			DeserializedPostDocument
		>
	}
}
