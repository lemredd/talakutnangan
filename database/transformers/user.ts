import type {
	AttributesObject,
	TransformerOptions,
	RelationshipTransformerInfo
} from "%/types/dependent"

import User from "%/models/user"
import Transformer from "%/transformers/base"
import Serializer from "%/transformers/serializer"
import DepartmentTransformer from "%/transformers/department"

export default class extends Transformer<User, void> {
	constructor() {
		super()
		this.type = "user"
		this.relationships = {
			department: this.department
		}
	}

	transform(model: User|User[], options: TransformerOptions): AttributesObject {
		const safeObject = Serializer.whitelist(model, [
			"id",
			"name",
			"email",
			"kind",
			"signature"
		])

		// TODO: Make URL to get the signature
		safeObject.signature = ""

		return safeObject
	}

	department(model: User, options: TransformerOptions): RelationshipTransformerInfo {
		return Serializer.makeContext(model.department, new DepartmentTransformer(), options)
	}
}
