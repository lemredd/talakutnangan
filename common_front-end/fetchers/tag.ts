import type { Response } from "$@/types/independent"
import type {
	TagResourceIdentifier,
	TagAttributes,
	TagResource,
	DeserializedTagResource,
	TagDocument,
	TagListDocument,
	DeserializedTagDocument,
	DeserializedTagListDocument,
	TagIdentifierListDocument
} from "$/types/documents/tag"

import { TAG_LINK } from "$/constants/template_links"

import BaseFetcher from "$@/fetchers/base"
import stringifyQuery from "$@/fetchers/stringify_query"

export default class TagFetcher extends BaseFetcher<
	TagResourceIdentifier<"read">,
	TagAttributes<"serialized">,
	TagAttributes<"deserialized">,
	TagResource,
	DeserializedTagResource,
	TagDocument,
	TagListDocument,
	DeserializedTagDocument,
	DeserializedTagListDocument
> {
	constructor() {
		super(TAG_LINK)
	}

	countPosts(IDs: string[]): Promise<Response<
		TagResourceIdentifier<"read">,
		TagAttributes<"serialized">,
		TagAttributes<"deserialized">,
		TagResource,
		DeserializedTagResource,
		TagIdentifierListDocument<"read">
	>> {
		return this.handleResponse(
			this.getJSON(
				`${this.links.unbound}/count_posts?${stringifyQuery({
					"filter": {
						IDs
					}
				})}`
			),
			false
		) as Promise<Response<
			TagResourceIdentifier<"read">,
			TagAttributes<"serialized">,
			TagAttributes<"deserialized">,
			TagResource,
			DeserializedTagResource,
			TagIdentifierListDocument<"read">
		>>
	}
}
