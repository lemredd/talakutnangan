import type { AttributesObject, TransformerOptions } from "%/types/dependent"

import AuditTrail from "%/models/audit_trail"
import Transformer from "%/transformers/base"
import UserTransformer from "%/transformers/user"
import Serializer from "%/transformers/serializer"

export default class extends Transformer<AuditTrail, void> {
	constructor() {
		super("audit_trail", [
			{
				"attribute": "user",
				"transformer": new UserTransformer()
			}
		])
	}

	transform(model: AuditTrail|AuditTrail[], unusedOptions: TransformerOptions): AttributesObject {
		const safeObject = Serializer.whitelist(model, [
			"id",
			"actionName",
			"extra",
			"createdAt"
		])

		return safeObject
	}
}
