import type { IncludedRelationships } from "%/types/independent"

import FoundPostWord from "%/models/found_post_word"
import Transformer from "%/transformers/base"
import ProfanityFilterTransformer from "%/transformers/profanity_filter"
import Serializer from "%/transformers/serializer"
import PostTransformer from "%/transformers/post"
import type { AttributesObject, TransformerOptions } from "%/types/dependent"

type Relationships = "post"|"profanity_filter"

export default class extends Transformer<FoundPostWord, void> {
	constructor({ included }: IncludedRelationships<Relationships> = {
		"included": [ "post", "profanity_filter" ]
	}) {
		super("found_post_word", [
			included.indexOf("post") > -1
				? {
					"attribute": "post",
					"transformer": new PostTransformer()
				}
				: null,
			included.indexOf("profanity_filter") > -1
				? {
					"attribute": "profanity_filter",
					"transformer": new ProfanityFilterTransformer()
				}
				: null
		])
	}


	transform(model: FoundPostWord|FoundPostWord[], unusedOptions: TransformerOptions)
	: AttributesObject {
		const safeObject = Serializer.whitelist(model, [
			"id"
		])

		return safeObject
	}
}
