import type { Response } from "$@/types/independent"
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
	CommentRelationships,
	CommentIdentifierListDocumentWithVotes
} from "$/types/documents/comment"

import { COMMENT_LINK, COUNT_COMMENT_VOTES } from "$/constants/template_links"

import BaseFetcher from "$@/fetchers/base"
import stringifyQuery from "$@/fetchers/stringify_query"

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

	countVotes(commentIDs: string[]): Promise<Response<
		CommentResourceIdentifier,
		CommentAttributes<"serialized">,
		CommentAttributes<"deserialized">,
		CommentResource,
		DeserializedCommentResource,
		CommentIdentifierListDocumentWithVotes
	>> {
		return this.handleResponse(
			this.getJSON(
				`${COUNT_COMMENT_VOTES}?${stringifyQuery({
					"filter": {
						"IDs": commentIDs
					}
				})}`
			),
			false
		) as Promise<Response<
			CommentResourceIdentifier,
			CommentAttributes<"serialized">,
			CommentAttributes<"deserialized">,
			CommentResource,
			DeserializedCommentResource,
			CommentIdentifierListDocumentWithVotes
		>>
	}
}
