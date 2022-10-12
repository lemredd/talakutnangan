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

import Role from "%/models/role"
import User from "%/models/user"
import Model from "%/models/post"
import Department from "%/models/department"
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

	private departmentGenerator: () => Promise<Department|null> = () => Promise.resolve(null)

	get model(): ModelCtor<Model> { return Model }

	get transformer(): Transformer { return new Transformer() }

	async generate(): GeneratedData<Model> {
		return {
			"attachedRoleID": (await this.posterInfoGenerator()).id,
			"content": this.contentGenerator(),
			"departmentID": (await this.departmentGenerator())?.id ?? null
		}
	}

	async attachRelatedModels(model: Model): Promise<Model> {
		model.posterInfo = await AttachedRole.findByPk(model.attachedRoleID, {
			"include": [
				{
					"model": User,
					"required": true
				},
				{
					"model": Role,
					"required": true
				}
			]
		}) as AttachedRole

		return model
	}

	posterInfo(generator: () => Promise<AttachedRole>): PostFactory {
		this.posterInfoGenerator = generator
		return this
	}

	department(generator: () => Promise<Department|null>): PostFactory {
		this.departmentGenerator = generator
		return this
	}
}
