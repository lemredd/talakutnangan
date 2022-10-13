/**
 * @description This module should not be used in production code. It only for testing purposes.
 */
import type { ModelCtor } from "%/types/dependent"
import type { GeneratedData } from "~/types/dependent"
import type {
	PostTagResourceIdentifier,
	PostTagAttributes,
	DeserializedPostTagResource,
	DeserializedPostTagDocument,
	DeserializedPostTagListDocument,
	PostTagResource,
	PostTagDocument,
	PostTagListDocument
} from "$/types/documents/post_tag"

import Tag from "%/models/tag"
import Post from "%/models/post"
import TagFactory from "~/factories/tag"
import BaseFactory from "~/factories/base"
import PostFactory from "~/factories/post"
import PostTag from "%/models/post_tag"
import PostTagTransformer from "%/transformers/post_tag"

export default class PostTagFactory extends BaseFactory<
	PostTag,
	PostTagResourceIdentifier<"read">,
	PostTagAttributes<"serialized">,
	PostTagAttributes<"deserialized">,
	PostTagResource,
	DeserializedPostTagResource,
	PostTagDocument,
	PostTagListDocument,
	DeserializedPostTagDocument,
	DeserializedPostTagListDocument
> {
	#tagGenerator: () => Promise<Tag> = async() => await new TagFactory().insertOne()
	#postGenerator: () => Promise<Post>
		= async() => await new PostFactory().insertOne()

	get model(): ModelCtor<PostTag> { return PostTag }

	get transformer(): PostTagTransformer { return new PostTagTransformer() }

	async generate(): GeneratedData<PostTag> {
		return {
			"postID": (await this.#postGenerator()).id,
			"tagID": (await this.#tagGenerator()).id
		}
	}

	async attachRelatedModels(model: PostTag): Promise<PostTag> {
		model.post = await Post.findByPk(model.postID) as Post
		model.tag = await Tag.findByPk(model.tagID) as Tag

		return model
	}

	tag(generator: () => Promise<Tag>): PostTagFactory {
		this.#tagGenerator = generator
		return this
	}

	post(generator: () => Promise<Post>): PostTagFactory {
		this.#postGenerator = generator
		return this
	}
}
