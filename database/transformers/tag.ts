import Tag from "%/models/tag"
import Transformer from "%/transformers/base"
import Serializer from "%/transformers/serializer"
import type { AttributesObject, TransformerOptions } from "%/types/dependent"

export default class extends Transformer<Tag, void> {
	constructor() {
		super("tag")
	}

	transform(model: Tag|Tag[], unusedOptions: TransformerOptions<void>): AttributesObject {
		const safeObject = Serializer.whitelist(model, [
			"id",
			"name",
			"deletedAt"
		])

		return safeObject
	}
}
