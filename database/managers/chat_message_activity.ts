import type { ModelCtor } from "%/types/dependent"
import type { CommonQueryParameters } from "$/types/query"
import type { ChatMessageActivityAttributes } from "$/types/documents/chat_message_activity"

import BaseManager from "%/managers/base"
import ChatMessageActivity from "%/models/chat_message_activity"
import ChatMessageActivityTransformer from "%/transformers/chat_message_activity"

export default class extends BaseManager<
	ChatMessageActivity,
	ChatMessageActivityAttributes,
	CommonQueryParameters
> {
	get model(): ModelCtor<ChatMessageActivity> { return ChatMessageActivity }

	get transformer(): ChatMessageActivityTransformer { return new ChatMessageActivityTransformer() }
}
