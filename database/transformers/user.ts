import User from "%/models/user"
import Transformer from "%/transformers/base"
import Serializer from "%/transformers/serializer"
import type { AttributesObject, TransformerOptions } from "%/types/dependent"

export default class extends Transformer<User, void> {
	constructor() {
		super()
		this.type = "user"
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
}
