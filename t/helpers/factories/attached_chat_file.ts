import type { ModelCtor } from "%/types/dependent"
import type { GeneratedData } from "~/types/dependent"
import type { FileLikeTransformerOptions } from "%/types/independent"
import type {
	AttachedChatFileResource,
	AttachedChatFileDocument,
	AttachedChatFileAttributes,
	AttachedChatFileListDocument,
	AttachedChatFileResourceIdentifier,
	DeserializedAttachedChatFileResource,
	DeserializedAttachedChatFileDocument,
	DeserializedAttachedChatFileListDocument
} from "$/types/documents/attached_chat_file"

import ChatMessage from "%/models/chat_message"
import FileLikeFactory from "~/factories/file-like"
import ChatMessageFactory from "~/factories/chat_message"
import AttachedChatFile from "%/models/attached_chat_file"
import AttachedChatFileTransformer from "%/transformers/attached_chat_file"

export default class AttachedChatFileFactory extends FileLikeFactory<
	AttachedChatFile,
	AttachedChatFileResourceIdentifier<"read">,
	AttachedChatFileAttributes<"raw">,
	AttachedChatFileAttributes<"raw">,
	AttachedChatFileResource<"read", "raw">,
	DeserializedAttachedChatFileResource<"raw">,
	AttachedChatFileDocument<"read", "raw">,
	AttachedChatFileListDocument<"read", "raw">,
	DeserializedAttachedChatFileDocument<"raw">,
	DeserializedAttachedChatFileListDocument<"raw">,
	FileLikeTransformerOptions
> {
	#chatMessage: () => Promise<ChatMessage> = async() => await new ChatMessageFactory().insertOne()

	get model(): ModelCtor<AttachedChatFile> { return AttachedChatFile }

	get transformer(): AttachedChatFileTransformer { return new AttachedChatFileTransformer() }

	async generate(): GeneratedData<AttachedChatFile> {
		return {
			"chatMessageID": (await this.#chatMessage()).id,
			"fileContents": this.fileContentsGenerator()
		}
	}

	chatMessage(generator: () => Promise<ChatMessage>): AttachedChatFileFactory {
		this.#chatMessage = generator
		return this
	}
}
