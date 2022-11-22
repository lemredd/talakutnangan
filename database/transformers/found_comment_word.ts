import type { IncludedRelationships } from "%/types/independent"

import FoundCommentWord from "%/models/found_comment_word"
import Transformer from "%/transformers/base"
import ProfanityFilterTransformer from "%/transformers/profanity_filter"
import Serializer from "%/transformers/serializer"
import PostTransformer from "%/transformers/comment"
import type { AttributesObject, TransformerOptions } from "%/types/dependent"

type Relationships = "comment"|"profanity_filter"

export default class extends Transformer<FoundCommentWord, void> {
	constructor({ included }: IncludedRelationships<Relationships> = {
		"included": [ "comment", "profanity_filter" ]
	}) {
		super("found_comment_word", [
			included.indexOf("comment") > -1
				? {
					"attribute": "comment",
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


	transform(model: FoundCommentWord|FoundCommentWord[], unusedOptions: TransformerOptions)
	: AttributesObject {
		const safeObject = Serializer.whitelist(model, [
			"id"
		])

		return safeObject
	}
}
