import type { IncludedRelationships } from "%/types/independent"
import type { AttributesObject, TransformerOptions } from "%/types/dependent"

import Transformer from "%/transformers/base"
import ChatMessage from "%/models/chat_message"
import UserTransformer from "%/transformers/user"
import Serializer from "%/transformers/serializer"
import ConsultationTransformer from "%/transformers/consultation"
import ChatMessageActivityTransformer from "%/transformers/chat_message_activity"
import AttachedChatFileTransformer from "%/transformers/attached_chat_file"

type Relationships = "user"|"consultation"|"chatMessageActivity"|"attachedChatFile"

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
				: null,
			included.indexOf("chatMessageActivity") > -1
				? {
					"attribute": "chatMessageActivity",
					"transformer": new ChatMessageActivityTransformer({
						"included": [ "user", "consultation" ]
					})
				}
				: null,
			included.indexOf("attachedChatFile") > -1
				? {
					"attribute": "attachedChatFile",
					"transformer": new AttachedChatFileTransformer()
				}
				: null
		])
	}

	transform(model: ChatMessage|ChatMessage[], unusedOptions: TransformerOptions)
	: AttributesObject {
		const safeObject = Serializer.whitelist(model, [
			"id",
			"kind",
			"data",
			"createdAt",
			"updatedAt"
		])

		return safeObject
	}
}
