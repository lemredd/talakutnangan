import type { PostQueryParameters } from "$/types/query"
import type {
	PostResourceIdentifier,
	PostAttributes,
	PostResource,
	DeserializedPostResource,
	PostDocument,
	PostListDocument,
	DeserializedPostDocument,
	DeserializedPostListDocument,
	PostRelationships
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
		"queryParameters": PostQueryParameters<string>,
		"extraCreateData": PostRelationships<"create">,
		"extraUpdateData": PostRelationships<"update">
	}
> {
	constructor() {
		super(POST_LINK)
	}
}
