import type { AttributesObject, TransformerOptions } from "%/types/dependent"

import Semester from "%/models/semester"
import Transformer from "%/transformers/base"
import Serializer from "%/transformers/serializer"

export default class extends Transformer<Semester, void> {
	constructor() {
		super("semester")
	}

	transform(model: Semester|Semester[], unusedOptions: TransformerOptions): AttributesObject {
		const safeObject = Serializer.whitelist(model, [
			"id",
			"name",
			"semesterOrder",
			"startAt",
			"endAt",
			"deletedAt"
		])

		return safeObject
	}
}
