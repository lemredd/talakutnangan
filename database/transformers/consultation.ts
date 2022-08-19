import type { IncludedForeignAttributes } from "%/types/independent"
import type { AttributesObject, TransformerOptions } from "%/types/dependent"

import Transformer from "%/transformers/base"
import Consultation from "%/models/consultation"
import UserTransformer from "%/transformers/user"
import RoleTransformer from "%/transformers/role"
import Serializer from "%/transformers/serializer"

type ForeignAttributes = "consultant"|"consultantRole"|"consulters"

export default class extends Transformer<Consultation, void> {
	constructor(
		{ included }: IncludedForeignAttributes<ForeignAttributes> = {
			"included": [ "consultant", "consultantRole", "consulters" ]
		}
	) {
		super("consultation", [
			included.indexOf("consultant")
				? {
					"attribute": "consultant",
					"transformer": new UserTransformer()
				}
				: null,
			included.indexOf("consultantRole")
				? {
					"attribute": "consultantRole",
					"transformer": new RoleTransformer()
				}
				: null,
			included.indexOf("consulters")
				? {
					"attribute": "consulters",
					"transformer": new UserTransformer()
				}
				: null
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
