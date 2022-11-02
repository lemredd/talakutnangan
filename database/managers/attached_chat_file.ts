import type { Pipe } from "$/types/database"
import type { GeneralObject } from "$/types/general"
import type { RawAttachedChatFile } from "$!/types/independent"
import type { FileLikeTransformerOptions } from "%/types/independent"
import type { Model as BaseModel, ModelCtor, FindAndCountOptions } from "%/types/dependent"

import User from "%/models/user"
import BaseManager from "%/managers/base"
import ChatMessage from "%/models/chat_message"
import Model from "%/models/attached_chat_file"
import Transformer from "%/transformers/attached_chat_file"
import ChatMessageActivity from "%/models/chat_message_activity"

import includeDefaults from "%/queries/attached_chat_file/include_defaults"

export default class extends BaseManager<
	Model,
	RawAttachedChatFile,
	GeneralObject,
	FileLikeTransformerOptions
> {
	get model(): ModelCtor<Model> { return Model }

	get transformer(): Transformer { return new Transformer() }

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

	get singleReadPipeline(): Pipe<
		FindAndCountOptions<Model>,
		GeneralObject
	>[] {
		return [
			includeDefaults,
			...super.singleReadPipeline
		]
	}
}
