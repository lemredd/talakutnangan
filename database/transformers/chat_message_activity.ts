import type { SubtransformerList } from "%/types/hybrid"
import type { AttributesObject, TransformerOptions } from "%/types/dependent"

import Transformer from "%/transformers/base"
import UserTransformer from "%/transformers/user"
import Serializer from "%/transformers/serializer"
import ChatMessageActivity from "%/models/chat_message_activity"
import ConsultationTransformer from "%/transformers/consultation"

export default class extends Transformer<ChatMessageActivity, void> {
	constructor({ included = [ "user" ] }: { included?: ("user"|"consultation")[] } = {}) {
		super("chat_message_activity", [
			included.indexOf("user") > -1
				? {
					"attribute": "user",
					"transformer": new UserTransformer()
				}
				: null,
			included.indexOf("user") > -1
				? {
					"attribute": "consultation",
					"transformer": new ConsultationTransformer()
				}
				: null
		].filter(Boolean) as SubtransformerList)
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
