import type { Response } from "$@/types/independent"
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
import { MULTIPART_MEDIA_TYPE } from "$/types/server"

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
	{
		"queryParameters": ChatMessageQueryParameters<string>,
		"extraCreateData": ChatMessageRelationships<"create">
	}
> {
	static initialize(basePath: string) {
		super.initialize(basePath, "chat_message")
	}

	constructor() {
		super(ChatMessageFetcher.basePath, ChatMessageFetcher.type)
	}

	async createWithFile(document: FormData): Promise<Response<
		ChatMessageResourceIdentifier,
		ChatMessageAttributes<"serialized">,
		ChatMessageAttributes<"deserialized">,
		ChatMessageResource,
		DeserializedChatMessageResource,
		DeserializedChatMessageDocument<"attachedChatFile"|"user">
	>> {
		const headers = this.makeJSONHeaders(MULTIPART_MEDIA_TYPE)

		return await this.handleResponse(
			this.postTo("chat_message/create_with_file", document, headers)
		) as Response<
			ChatMessageResourceIdentifier,
			ChatMessageAttributes<"serialized">,
			ChatMessageAttributes<"deserialized">,
			ChatMessageResource,
			DeserializedChatMessageResource,
			DeserializedChatMessageDocument<"attachedChatFile"|"user">
		>
	}
}
