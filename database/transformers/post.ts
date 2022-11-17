import type { IncludedRelationships } from "%/types/independent"
import type { AttributesObject, TransformerOptions } from "%/types/dependent"

import Model from "%/models/post"
import Transformer from "%/transformers/base"
import TagTransformer from "%/transformers/tag"
import UserTransformer from "%/transformers/user"
import RoleTransformer from "%/transformers/role"
import Serializer from "%/transformers/serializer"
import DepartmentTransformer from "%/transformers/department"
import PostAttachmentTransformer from "%/transformers/post_attachment"

type Relationships =
	| "tags"
	| "poster"
	| "posterRole"
	| "department"
	| "postAttachments"

export default class extends Transformer<Model, void> {
	constructor(
		{ included }: IncludedRelationships<Relationships> = {
			"included": [ "poster", "posterRole", "department", "postAttachments", "tags" ]
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
				: null,
			included.indexOf("department") > -1
				? {
					"attribute": "department",
					"transformer": new DepartmentTransformer()
				}
				: null,
			included.indexOf("postAttachments") > -1
				? {
					"attribute": "postAttachments",
					"transformer": new PostAttachmentTransformer()
				}
				: null,
			included.indexOf("tags") > -1
				? {
					"attribute": "tags",
					"transformer": new TagTransformer()
				}
				: null
		])
	}

	transform(model: Model|Model[], unusedOptions: TransformerOptions): AttributesObject {
		const safeObject = Serializer.whitelist(model, [
			"id",
			"content",
			"createdAt",
			"updatedAt",
			"deletedAt"
		])

		return safeObject
	}
}
