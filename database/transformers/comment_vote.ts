import type { IncludedRelationships } from "%/types/independent"
import type { AttributesObject, TransformerOptions } from "%/types/dependent"

import Transformer from "%/transformers/base"
import Model from "%/models/comment_vote"
import CommentTransformer from "%/transformers/comment"
import Serializer from "%/transformers/serializer"
import UserTransformer from "%/transformers/user"

type Relationships = "comment"|"user"

export default class extends Transformer<Model, void> {
	constructor({ included }: IncludedRelationships<Relationships> = {
		"included": [ "comment", "user" ]
	}) {
		super("comment_vote", [
			included.indexOf("comment") > -1
				? {
					"attribute": "comment",
					"transformer": new CommentTransformer()
				}
				: null,
			included.indexOf("user") > -1
				? {
					"attribute": "user",
					"transformer": new UserTransformer()
				}
				: null
		])
	}

	transform(
		model: Model|Model[], unusedOptions: TransformerOptions): AttributesObject {
		const safeObject = Serializer.whitelist(model, [
			"kind"
		])

		return safeObject
	}
}
