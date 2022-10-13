import type { CommonQueryParameters } from "$/types/query"
import type { ModelCtor } from "%/types/dependent"
import type { TagAttributes } from "$/types/documents/tag"

import BaseManager from "%/managers/base"
import Tag from "%/models/tag"

import TagTransformer from "%/transformers/tag"

export default class extends BaseManager<
	Tag,
	TagAttributes<"deserialized">,
	CommonQueryParameters
> {
	get model(): ModelCtor<Tag> { return Tag }

	get transformer(): TagTransformer { return new TagTransformer() }
}
