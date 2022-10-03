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
	DeserializedPostListDocument
> {
	constructor() {
		super(POST_LINK)
	}
}
