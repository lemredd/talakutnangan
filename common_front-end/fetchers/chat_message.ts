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

import { CHAT_MESSAGE_LINK, CREATE_CHAT_MESSAGE_WITH_FILE_LINK } from "$/constants/template_links"

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
	constructor() {
		super(CHAT_MESSAGE_LINK)
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
			this.postTo(CREATE_CHAT_MESSAGE_WITH_FILE_LINK, document, headers)
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
