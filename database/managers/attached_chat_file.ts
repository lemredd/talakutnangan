import type { ModelCtor } from "%/types/dependent"
import type { GeneralObject } from "$/types/general"
import type { RawAttachedChatFile } from "$!/types/independent"
import type { FileLikeTransformerOptions } from "%/types/independent"

import BaseManager from "%/managers/base"
import AttachedChatFile from "%/models/profile_picture"
import AttachedChatFileTransformer from "%/transformers/profile_picture"

export default class extends BaseManager<
	AttachedChatFile,
	RawAttachedChatFile,
	GeneralObject,
	FileLikeTransformerOptions
> {
	get model(): ModelCtor<AttachedChatFile> { return AttachedChatFile }

	get transformer(): AttachedChatFileTransformer { return new AttachedChatFileTransformer() }
}
