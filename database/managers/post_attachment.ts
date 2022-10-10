import type { ModelCtor } from "%/types/dependent"
import type { GeneralObject } from "$/types/general"
import type { RawPostAttachment } from "$!/types/independent"
import type { FileLikeTransformerOptions } from "%/types/independent"

import BaseManager from "%/managers/base"
import Model from "%/models/profile_picture"
import Transformer from "%/transformers/profile_picture"

export default class extends BaseManager<
	Model,
	RawPostAttachment,
	GeneralObject,
	FileLikeTransformerOptions
> {
	get model(): ModelCtor<Model> { return Model }

	get transformer(): Transformer { return new Transformer() }
}
