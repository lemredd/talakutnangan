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
	|"comments"
	|"parentComment"

export default class CommentTransformer extends Transformer<Model, void> {
	constructor(
		{ included }: IncludedRelationships<Relationships> = {
			"included": [ "user", "post", "parentComment" ]
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
				: null,
			included.indexOf("parentComment") > -1
				? {
					"attribute": "parentComment",
					// Prevent recursion to parent comment by ignoring from possible transformers.
					"transformer": new CommentTransformer({
						"included": [ "user", "post" ]
					})
				}
				: null,
			included.indexOf("comments") > -1
				? {
					"attribute": "comments",
					"transformer": new CommentTransformer()
				}
				: null
		])
	}

	transform(model: Model|Model[], unusedOptions: TransformerOptions): AttributesObject {
		const safeObject = Serializer.whitelist(model, [
			"id",
			"content"
		])

		return safeObject
	}
}
