import type { IncludedRelationships } from "%/types/independent"
import type { AttributesObject, TransformerOptions } from "%/types/dependent"

import Transformer from "%/transformers/base"
import ChatMessage from "%/models/chat_message"
import UserTransformer from "%/transformers/user"
import Serializer from "%/transformers/serializer"
import ConsultationTransformer from "%/transformers/consultation"

type Relationships = "user"|"consultation"

export default class extends Transformer<ChatMessage, void> {
	constructor({ included }: IncludedRelationships<Relationships> = { "included": [ "user" ] }) {
		super("chat_message", [
			included.indexOf("user") > -1
				? {
					"attribute": "user",
					"transformer": new UserTransformer()
				}
				: null,
			included.indexOf("consultation") > -1
				? {
					"attribute": "consultation",
					"transformer": new ConsultationTransformer()
				}
				: null
		])
	}

	transform(model: ChatMessage|ChatMessage[], unusedOptions: TransformerOptions)
	: AttributesObject {
		const safeObject = Serializer.whitelist(model, [
			"id",
			"message"
		])

		return safeObject
	}
}
