import type {
	AttributesObject,
	TransformerOptions,
	RelationshipTransformerInfo
} from "%/types/dependent"

import AuditTrail from "%/models/audit_trail"
import Transformer from "%/transformers/base"
import UserTransformer from "%/transformers/user"
import Serializer from "%/transformers/serializer"

export default class extends Transformer<AuditTrail, void> {
	constructor() {
		super()
		this.type = "audit_trail"

		this.subtransformers = {
			user: {
				attribute: "user",
				transformer: new UserTransformer()
			}
		}

		this.relationships = {
			user: this.user.bind(this)
		}
	}

	transform(model: AuditTrail|AuditTrail[], options: TransformerOptions): AttributesObject {
		const safeObject = Serializer.whitelist(model, [
			"id",
			"actionName",
			"extra",
			"createdAt"
		])

		return safeObject
	}

	user(model: AuditTrail, options: TransformerOptions): RelationshipTransformerInfo {
		return Serializer.makeContext(
			model.user || null,
			this.subtransformers["user"].transformer as UserTransformer,
			options
		)
	}
}
