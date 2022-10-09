import type { AttributesObject, TransformerOptions } from "%/types/dependent"

import Transformer from "%/transformers/base"
import Model from "%/models/employee_schedule"
import Serializer from "%/transformers/serializer"

export default class extends Transformer<Model, void> {
	constructor() {
		super("employee_schedule")
	}

	transform(model: Model|Model[], unusedOptions: TransformerOptions)
	: AttributesObject {
		const safeObject = Serializer.whitelist(model, [
			"id",
			"scheduleStart",
			"scheduleEnd",
			"dayName"
		])

		return safeObject
	}
}
