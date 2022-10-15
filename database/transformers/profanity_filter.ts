import ProfanityFilter from "%/models/profanity_filter"
import Transformer from "%/transformers/base"
import Serializer from "%/transformers/serializer"
import type { AttributesObject, TransformerOptions } from "%/types/dependent"

export default class extends Transformer<ProfanityFilter, void> {
	constructor() {
		super("profanity_filter")
	}

	transform(model: ProfanityFilter|ProfanityFilter[],
		unusedOptions: TransformerOptions<void>): AttributesObject {
		const safeObject = Serializer.whitelist(model, [
			"id",
			"word",
			"deletedAt"
		])

		return safeObject
	}
}
