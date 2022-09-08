import type { ModelCtor } from "%/types/dependent"
import type { GeneralObject } from "$/types/general"
import type { RawAttachedChatFile } from "$!/types/independent"
import type { FileLikeTransformerOptions } from "%/types/independent"

import BaseManager from "%/managers/base"
import AttachedChatFile from "%/models/attached_chat_file"
import AttachedChatFileTransformer from "%/transformers/attached_chat_file"

export default class extends BaseManager<
	AttachedChatFile,
	RawAttachedChatFile,
	GeneralObject,
	FileLikeTransformerOptions
> {
	get model(): ModelCtor<AttachedChatFile> { return AttachedChatFile }

	get transformer(): AttachedChatFileTransformer { return new AttachedChatFileTransformer() }
}
