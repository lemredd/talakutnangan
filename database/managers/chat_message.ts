import type { ModelCtor } from "%/types/dependent"
import type { CommonQueryParameters } from "$/types/query"
import type { ChatMessageAttributes } from "$/types/documents/chat_message"

import BaseManager from "%/managers/base"
import ChatMessage from "%/models/chat_message"
import ChatMessageTransformer from "%/transformers/chat_message"

export default class extends BaseManager<
	ChatMessage,
	ChatMessageAttributes<"deserialized">,
	CommonQueryParameters
> {
	get model(): ModelCtor<ChatMessage> { return ChatMessage }

	get transformer(): ChatMessageTransformer { return new ChatMessageTransformer() }
}
