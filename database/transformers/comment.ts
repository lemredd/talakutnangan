import type { IncludedRelationships } from "%/types/independent"
import type { AttributesObject, TransformerOptions } from "%/types/dependent"

import Model from "%/models/comment"
import Transformer from "%/transformers/base"
import UserTransformer from "%/transformers/user"
import PostTransformer from "%/transformers/post"
import Serializer from "%/transformers/serializer"

type Relationships =
	|"user"
	|"post"

export default class CommentTransformer extends Transformer<Model, void> {
	constructor(
		{ included }: IncludedRelationships<Relationships> = {
			"included": [ "user", "post" ]
		}
	) {
		super("comment", [
			included.indexOf("user") > -1
				? {
					"attribute": "user",
					"transformer": new UserTransformer()
				}
				: null,
			included.indexOf("post") > -1
				? {
					"attribute": "post",
					"transformer": new PostTransformer()
				}
				: null
		])
	}

	transform(model: Model|Model[], unusedOptions: TransformerOptions): AttributesObject {
		const safeObject = Serializer.whitelist(model, [
			"id",
			"content",
			"createdAt",
			"updatedAt"
		])

		return safeObject
	}
}
