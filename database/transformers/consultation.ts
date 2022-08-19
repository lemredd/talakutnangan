import type { AttributesObject, TransformerOptions } from "%/types/dependent"

import Transformer from "%/transformers/base"
import Consultation from "%/models/consultation"
import UserTransformer from "%/transformers/user"
import RoleTransformer from "%/transformers/role"
import Serializer from "%/transformers/serializer"

export default class extends Transformer<Consultation, void> {
	constructor() {
		super("consultation", [
			{
				"attribute": "consultant",
				"transformer": new UserTransformer()
			},
			{
				"attribute": "consultantRole",
				"transformer": new RoleTransformer()
			},
			{
				"attribute": "consulters",
				"transformer": new UserTransformer()
			}
		])
	}

	transform(model: Consultation|Consultation[], unusedOptions: TransformerOptions)
	: AttributesObject {
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
