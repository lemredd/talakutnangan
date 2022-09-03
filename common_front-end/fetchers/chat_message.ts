import type { Serializable } from "$/types/general"
import type { ChatMessageQueryParameters } from "$/types/query"
import type {
	ChatMessageResourceIdentifier,
	ChatMessageAttributes,
	ChatMessageResource,
	DeserializedChatMessageResource,
	ChatMessageDocument,
	ChatMessageListDocument,
	DeserializedChatMessageDocument,
	DeserializedChatMessageListDocument,
	ChatMessageRelationships
} from "$/types/documents/chat_message"
import BaseFetcher from "$@/fetchers/base"

export default class ChatMessageFetcher extends BaseFetcher<
	ChatMessageResourceIdentifier,
	ChatMessageAttributes<"serialized">,
	ChatMessageAttributes<"deserialized">,
	ChatMessageResource,
	DeserializedChatMessageResource,
	ChatMessageDocument,
	ChatMessageListDocument,
	DeserializedChatMessageDocument,
	DeserializedChatMessageListDocument,
	Serializable,
	ChatMessageQueryParameters<string>,
	ChatMessageRelationships
> {
	static initialize(basePath: string) {
		super.initialize(basePath, "chat_message")
	}

	constructor() {
		super(ChatMessageFetcher.basePath, ChatMessageFetcher.type)
	}
}
