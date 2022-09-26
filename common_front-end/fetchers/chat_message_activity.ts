import type { ChatMessageActivityQueryParameters } from "$/types/query"
import type {
	ChatMessageActivityResourceIdentifier,
	ChatMessageActivityAttributes,
	ChatMessageActivityResource,
	DeserializedChatMessageActivityResource,
	ChatMessageActivityDocument,
	ChatMessageActivityListDocument,
	DeserializedChatMessageActivityDocument,
	DeserializedChatMessageActivityListDocument,
	ChatMessageActivityRelationships
} from "$/types/documents/chat_message_activity"

import BaseFetcher from "$@/fetchers/base"

export default class ChatMessageActivityFetcher extends BaseFetcher<
	ChatMessageActivityResourceIdentifier,
	ChatMessageActivityAttributes<"serialized">,
	ChatMessageActivityAttributes<"deserialized">,
	ChatMessageActivityResource,
	DeserializedChatMessageActivityResource,
	ChatMessageActivityDocument,
	ChatMessageActivityListDocument,
	DeserializedChatMessageActivityDocument,
	DeserializedChatMessageActivityListDocument,
	{
		"queryParameters": ChatMessageActivityQueryParameters<string>,
		"extraCreateData": ChatMessageActivityRelationships<"create">
	}
> {
	static initialize(basePath: string) {
		super.initialize(basePath, "chat_message")
	}

	constructor() {
		super(ChatMessageActivityFetcher.basePath, ChatMessageActivityFetcher.type)
	}
}
