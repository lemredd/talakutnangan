import type { ModelCtor } from "%/types/dependent"
import type { GeneratedData } from "~/types/dependent"
import type {
	CommentVoteResourceIdentifier,
	CommentVoteAttributes,
	DeserializedCommentVoteResource,
	DeserializedCommentVoteDocument,
	DeserializedCommentVoteListDocument,
	CommentVoteResource,
	CommentVoteDocument,
	CommentVoteListDocument
} from "$/types/documents/comment_vote"
import { VoteKind } from "$/types/database"

import User from "%/models/user"
import Comment from "%/models/comment"
import Model from "%/models/comment_vote"
import BaseFactory from "~/factories/base"
import UserFactory from "~/factories/user"
import CommentFactory from "~/factories/comment"
import Transformer from "%/transformers/comment_vote"

export default class CommentVoteFactory extends BaseFactory<
	Model,
	CommentVoteResourceIdentifier,
	CommentVoteAttributes<"serialized">,
	CommentVoteAttributes<"deserialized">,
	CommentVoteResource<"read">,
	DeserializedCommentVoteResource,
	CommentVoteDocument,
	CommentVoteListDocument,
	DeserializedCommentVoteDocument,
	DeserializedCommentVoteListDocument
> {
	private userGenerator: () => Promise<User> = () => new UserFactory().insertOne()
	private parentCommentGenerator: () => Promise<Comment> = () => new CommentFactory().insertOne()
	#kind = () => "upvote"

	get model(): ModelCtor<Model> { return Model }

	get transformer(): Transformer { return new Transformer() }

	async generate(): GeneratedData<Model> {
		return {
			"commentID": (await this.parentCommentGenerator())?.id,
			"userID": (await this.userGenerator()).id,
			"kind": this.#kind()
		}
	}

	user(generator: () => Promise<User>): CommentVoteFactory {
		this.userGenerator = generator
		return this
	}

	parentCommentVote(generator: () => Promise<Comment>): CommentVoteFactory {
		this.parentCommentGenerator = generator
		return this
	}

	kind(generator: () => VoteKind): CommentVoteFactory {
		this.#kind = generator
		return this
	}
}
