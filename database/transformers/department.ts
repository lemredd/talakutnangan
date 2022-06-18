import Department from "%/models/department"
import Transformer from "%/transformers/base"
import Serializer from "%/transformers/serializer"
import type { AttributesObject, TransformerOptions } from "%/types/dependent"

export default class extends Transformer<Department, void> {
	constructor() {
		super()
		this.type = "department"
	}

	transform(model: Department|Department[], options: TransformerOptions): AttributesObject {
		const safeObject = Serializer.whitelist(model, [
			"id",
			"acronym",
			"fullName",
			"mayAdmit"
		])

		return safeObject
	}
}
