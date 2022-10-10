import type {
	CommentResourceIdentifier,
	CommentAttributes,
	CommentResource,
	DeserializedCommentResource,
	CommentDocument,
	CommentListDocument,
	DeserializedCommentDocument,
	DeserializedCommentListDocument
} from "$/types/documents/comment"

import { POST_LINK } from "$/constants/template_links"

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
	DeserializedCommentListDocument
> {
	constructor() {
		super(POST_LINK)
	}
}
