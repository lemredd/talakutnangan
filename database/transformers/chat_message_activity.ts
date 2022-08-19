import type { AttributesObject, TransformerOptions } from "%/types/dependent"

import Transformer from "%/transformers/base"
import UserTransformer from "%/transformers/user"
import Serializer from "%/transformers/serializer"
import ChatMessageActivity from "%/models/chat_message_activity"
import ConsultationTransformer from "%/transformers/consultation"

export default class extends Transformer<ChatMessageActivity, void> {
	constructor() {
		super("chat_message_activity", [
			{
				"attribute": "user",
				"transformer": new UserTransformer()
			},
			{
				"attribute": "consultation",
				"transformer": new ConsultationTransformer()
			}
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
