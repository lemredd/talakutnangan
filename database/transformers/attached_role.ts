import type { IncludedRelationships } from "%/types/independent"
import type { AttributesObject, TransformerOptions } from "%/types/dependent"

import Transformer from "%/transformers/base"
import AttachedRole from "%/models/attached_role"
import UserTransformer from "%/transformers/user"
import RoleTransformer from "%/transformers/role"
import Serializer from "%/transformers/serializer"

type Relationships = "user"|"role"

export default class extends Transformer<AttachedRole, void> {
	constructor({ included }: IncludedRelationships<Relationships> = {
		"included": [ "user", "role" ]
	}) {
		super("attached_role", [
			included.indexOf("user") > -1
				? {
					"attribute": "user",
					"transformer": new UserTransformer()
				}
				: null,
			included.indexOf("role") > -1
				? {
					"attribute": "role",
					"transformer": new RoleTransformer()
				}
				: null
		])
	}

	transform(model: AttachedRole|AttachedRole[], unusedOptions: TransformerOptions)
	: AttributesObject {
		const safeObject = Serializer.whitelist(model, [
			"id"
		])

		return safeObject
	}
}
