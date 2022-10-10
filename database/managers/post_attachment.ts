import type { ModelCtor } from "%/types/dependent"
import type { GeneralObject } from "$/types/general"
import type { RawPostAttachment } from "$!/types/independent"
import type { FileLikeTransformerOptions } from "%/types/independent"

import BaseManager from "%/managers/base"
import Model from "%/models/post_attachment"
import Transformer from "%/transformers/post_attachment"

export default class extends BaseManager<
	Model,
	RawPostAttachment,
	GeneralObject,
	FileLikeTransformerOptions
> {
	get model(): ModelCtor<Model> { return Model }

	get transformer(): Transformer { return new Transformer() }
}
