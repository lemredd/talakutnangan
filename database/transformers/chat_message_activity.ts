import type { IncludedRelationships } from "%/types/independent"
import type { AttributesObject, TransformerOptions } from "%/types/dependent"

import Transformer from "%/transformers/base"
import UserTransformer from "%/transformers/user"
import Serializer from "%/transformers/serializer"
import ChatMessageActivity from "%/models/chat_message_activity"
import ConsultationTransformer from "%/transformers/consultation"

type Relationships = "user"|"consultation"

export default class extends Transformer<ChatMessageActivity, void> {
	constructor({ included }: IncludedRelationships<Relationships> = { "included": [ "user" ] }) {
		super("chat_message_activity", [
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

	transform(model: ChatMessageActivity|ChatMessageActivity[], unusedOptions: TransformerOptions)
	: AttributesObject {
		const safeObject = Serializer.whitelist(model, [
			"id",
			"receivedMessageAt",
			"seenMessageAt"
		])

		return safeObject
	}
}
