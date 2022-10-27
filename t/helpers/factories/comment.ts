import type { ModelCtor } from "%/types/dependent"
import type { GeneratedData } from "~/types/dependent"
import type {
	CommentResourceIdentifier,
	CommentAttributes,
	DeserializedCommentResource,
	DeserializedCommentDocument,
	DeserializedCommentListDocument,
	CommentResource,
	CommentDocument,
	CommentListDocument
} from "$/types/documents/comment"

import Post from "%/models/post"
import User from "%/models/user"
import Model from "%/models/comment"
import PostFactory from "~/factories/post"
import UserFactory from "~/factories/user"
import Transformer from "%/transformers/comment"
import TextContentLikeFactory from "~/factories/text_content-like"

export default class CommentFactory extends TextContentLikeFactory<
	Model,
	CommentResourceIdentifier,
	CommentAttributes<"serialized">,
	CommentAttributes<"deserialized">,
	CommentResource<"read">,
	DeserializedCommentResource,
	CommentDocument,
	CommentListDocument,
	DeserializedCommentDocument,
	DeserializedCommentListDocument
> {
	private postGenerator: () => Promise<Post> = () => new PostFactory().insertOne()
	private userGenerator: () => Promise<User> = () => new UserFactory().insertOne()

	get model(): ModelCtor<Model> { return Model }

	get transformer(): Transformer { return new Transformer() }

	async generate(): GeneratedData<Model> {
		return {
			"content": this.contentGenerator(),
			"postID": (await this.postGenerator()).id,
			"userID": (await this.userGenerator()).id
		}
	}

	post(generator: () => Promise<Post>): CommentFactory {
		this.postGenerator = generator
		return this
	}

	user(generator: () => Promise<User>): CommentFactory {
		this.userGenerator = generator
		return this
	}
}
