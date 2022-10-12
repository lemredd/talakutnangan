import type {
	CommentVoteResourceIdentifier,
	CommentVoteAttributes,
	CommentVoteResource,
	DeserializedCommentVoteResource,
	CommentVoteDocument,
	CommentVoteListDocument,
	DeserializedCommentVoteDocument,
	DeserializedCommentVoteListDocument
} from "$/types/documents/comment_vote"

import { COMMENT_VOTE_LINK } from "$/constants/template_links"

import BaseFetcher from "$@/fetchers/base"

export default class CommentVoteFetcher extends BaseFetcher<
	CommentVoteResourceIdentifier<"read">,
	CommentVoteAttributes<"serialized">,
	CommentVoteAttributes<"deserialized">,
	CommentVoteResource,
	DeserializedCommentVoteResource,
	CommentVoteDocument,
	CommentVoteListDocument,
	DeserializedCommentVoteDocument,
	DeserializedCommentVoteListDocument
> {
	constructor() {
		super(COMMENT_VOTE_LINK)
	}
}
