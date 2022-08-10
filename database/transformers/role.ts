import Role from "%/models/role"
import Transformer from "%/transformers/base"
import Serializer from "%/transformers/serializer"
import type { AttributesObject, TransformerOptions } from "%/types/dependent"

export default class extends Transformer<Role, void> {
	constructor() {
		super("role")
	}

	transform(model: Role|Role[], options: TransformerOptions): AttributesObject {
		const safeObject = Serializer.whitelist(model, [
			"id",
			"name",
			"departmentFlags",
			"roleFlags",
			"semesterFlags",
			"tagFlags",
			"postFlags",
			"commentFlags",
			"profanityFlags",
			"userFlags",
			"auditTrailFlags"
		])

		return safeObject
	}
}
