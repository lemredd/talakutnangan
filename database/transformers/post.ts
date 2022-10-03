import type { IncludedRelationships } from "%/types/independent"
import type { AttributesObject, TransformerOptions } from "%/types/dependent"

import Model from "%/models/post"
import Transformer from "%/transformers/base"
import UserTransformer from "%/transformers/user"
import RoleTransformer from "%/transformers/role"
import Serializer from "%/transformers/serializer"

type Relationships =
	|"poster"
	|"posterRole"

export default class extends Transformer<Model, void> {
	constructor(
		{ included }: IncludedRelationships<Relationships> = {
			"included": [ "poster", "posterRole" ]
		}
	) {
		super("post", [
			included.indexOf("poster") > -1
				? {
					"attribute": "poster",
					"transformer": new UserTransformer()
				}
				: null,
			included.indexOf("posterRole") > -1
				? {
					"attribute": "posterRole",
					"transformer": new RoleTransformer()
				}
				: null
		])
	}

	transform(model: Model|Model[], unusedOptions: TransformerOptions): AttributesObject {
		const safeObject = Serializer.whitelist(model, [
			"id",
			"content"
		])

		return safeObject
	}
}
