import Signature from "%/models/signature"
import Transformer from "%/transformers/base"
import Serializer from "%/transformers/serializer"
import type { AttributesObject, TransformerOptions } from "%/types/dependent"

export default class extends Transformer<Signature, { raw: boolean }> {
	constructor() {
		super()
		this.type = "role"
	}

	transform(model: Signature|Signature[], options: TransformerOptions<{ raw: boolean }>): AttributesObject {
		const whiteListedProperties = [ "id" ]

		if (options.extra === undefined) {
			options.extra = { raw: false }
		}

		const safeObject = Serializer.whitelist(model, [
			"id",
			"signature"
		])


		return safeObject
	}
}
