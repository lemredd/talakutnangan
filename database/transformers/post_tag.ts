import type { IncludedRelationships } from "%/types/independent"

import PostTag from "%/models/post_tag"
import Transformer from "%/transformers/base"
import TagTransformer from "%/transformers/tag"
import Serializer from "%/transformers/serializer"
import PostTransformer from "%/transformers/post"
import type { AttributesObject, TransformerOptions } from "%/types/dependent"

type Relationships = "post"|"tag"

export default class extends Transformer<PostTag, void> {
	constructor({ included }: IncludedRelationships<Relationships> = {
		"included": [ "post", "tag" ]
	}) {
		super("post_tag", [
			included.indexOf("post") > -1
				? {
					"attribute": "post",
					"transformer": new PostTransformer()
				}
				: null,
			included.indexOf("tag") > -1
				? {
					"attribute": "tag",
					"transformer": new TagTransformer()
				}
				: null
		])
	}


	transform(model: PostTag|PostTag[], unusedOptions: TransformerOptions)
	: AttributesObject {
		const safeObject = Serializer.whitelist(model, [
			"id"
		])

		return safeObject
	}
}
