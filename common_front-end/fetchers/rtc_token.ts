import type {
	CommentVoteResourceIdentifier,
	CommentVoteAttributes,
	CommentVoteResource,
	DeserializedCommentVoteResource,
	CommentVoteDocument,
	CommentVoteListDocument,
	DeserializedCommentVoteDocument,
	DeserializedCommentVoteListDocument,
	CommentVoteRelationships
} from "$/types/documents/comment_vote"

import { RTC_TOKEN_LINK } from "$/constants/template_links"

import BaseFetcher from "$@/fetchers/base"
import specializePath from "$/helpers/specialize_path"

export default class CommentVoteFetcher extends BaseFetcher<
	CommentVoteResourceIdentifier<"read">,
	CommentVoteAttributes<"serialized">,
	CommentVoteAttributes<"deserialized">,
	CommentVoteResource,
	DeserializedCommentVoteResource,
	CommentVoteDocument,
	CommentVoteListDocument,
	DeserializedCommentVoteDocument,
	DeserializedCommentVoteListDocument,
	{
		"extraCreateData": CommentVoteRelationships<"create">
	}
> {
	constructor() {
		super(COMMENT_VOTE_LINK)
	}
}
