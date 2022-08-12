import type { AttributesObject, TransformerOptions } from "%/types/dependent"

import Transformer from "%/transformers/base"
import Serializer from "%/transformers/serializer"
import Consultation from "%/models/consultation"

export default class extends Transformer<Consultation, void> {
	constructor() {
		super()
		this.type = "consultation"

		this.subtransformers = {

		}
	}

	transform(model: Consultation|Consultation[], options: TransformerOptions): AttributesObject {
		const safeObject = Serializer.whitelist(model, [
			"id",
			"reason",
			"status",
			"actionTaken",
			"scheduledStartDatetime",
			"endDatetime"
		])

		return safeObject
	}
}
