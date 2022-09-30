import type { ModelCtor } from "%/types/dependent"
import type { GeneratedData } from "~/types/dependent"
import type {
	PostResourceIdentifier,
	PostAttributes,
	DeserializedPostResource,
	DeserializedPostDocument,
	DeserializedPostListDocument,
	PostResource,
	PostDocument,
	PostListDocument
} from "$/types/documents/post"

import Model from "%/models/post"
import Transformer from "%/transformers/post"
import AttachedRole from "%/models/attached_role"
import AttachedRoleFactory from "~/factories/attached_role"
import TextContentLikeFactory from "~/factories/text_content-like"

export default class PostFactory extends TextContentLikeFactory<
	Model,
	PostResourceIdentifier<"read">,
	PostAttributes<"serialized">,
	PostAttributes<"deserialized">,
	PostResource<"read">,
	DeserializedPostResource,
	PostDocument,
	PostListDocument,
	DeserializedPostDocument,
	DeserializedPostListDocument
> {
	private posterInfoGenerator: () => Promise<AttachedRole>
		= () => new AttachedRoleFactory().insertOne()

	get model(): ModelCtor<Model> { return Model }

	get transformer(): Transformer { return new Transformer() }

	async generate(): GeneratedData<Model> {
		return {
			"attachedRoleID": (await this.posterInfoGenerator()).id,
			"content": this.contentGenerator()
		}
	}

	posterInfo(generator: () => Promise<AttachedRole>): PostFactory {
		this.posterInfoGenerator = generator
		return this
	}
}
