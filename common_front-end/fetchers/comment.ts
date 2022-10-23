import type { CommentQueryParameters } from "$/types/query"
import type {
	CommentResourceIdentifier,
	CommentAttributes,
	CommentResource,
	DeserializedCommentResource,
	CommentDocument,
	CommentListDocument,
	DeserializedCommentDocument,
	DeserializedCommentListDocument,
	CommentRelationships
} from "$/types/documents/comment"

import { COMMENT_LINK } from "$/constants/template_links"

import BaseFetcher from "$@/fetchers/base"

export default class CommentFetcher extends BaseFetcher<
	CommentResourceIdentifier<"read">,
	CommentAttributes<"serialized">,
	CommentAttributes<"deserialized">,
	CommentResource,
	DeserializedCommentResource,
	CommentDocument,
	CommentListDocument,
	DeserializedCommentDocument,
	DeserializedCommentListDocument,
	{
		"queryParameters": CommentQueryParameters<string>,
		"extraCreateData": CommentRelationships<"create">
	}
> {
	constructor() {
		super(COMMENT_LINK)
	}
}
