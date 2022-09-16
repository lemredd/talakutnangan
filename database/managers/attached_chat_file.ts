import type { GeneralObject } from "$/types/general"
import type { RawAttachedChatFile } from "$!/types/independent"
import type { FileLikeTransformerOptions } from "%/types/independent"
import type { ModelCtor, Model as BaseModel } from "%/types/dependent"

import User from "%/models/user"
import BaseManager from "%/managers/base"
import ChatMessage from "%/models/chat_message"
import AttachedChatFile from "%/models/attached_chat_file"
import ChatMessageActivity from "%/models/chat_message_activity"
import AttachedChatFileTransformer from "%/transformers/attached_chat_file"

export default class extends BaseManager<
	AttachedChatFile,
	RawAttachedChatFile,
	GeneralObject,
	FileLikeTransformerOptions
> {
	get model(): ModelCtor<AttachedChatFile> { return AttachedChatFile }

	get transformer(): AttachedChatFileTransformer { return new AttachedChatFileTransformer() }

	get modelChainToUser(): readonly ModelCtor<BaseModel>[] {
		return [
			ChatMessage,
			ChatMessageActivity,
			User
		]
	}

	protected get exposableColumns(): string[] {
		const excludedColumns = new Set([ "id", "chatMessageID" ])
		return super.exposableColumns.filter(columnName => !excludedColumns.has(columnName))
	}
}
