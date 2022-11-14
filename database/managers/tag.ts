import type { Pipe } from "$/types/database"
import type { SemesterQueryParameters } from "$/types/query"
import type { FindAndCountOptions, ModelCtor } from "%/types/dependent"
import type { TagAttributes } from "$/types/documents/tag"

import BaseManager from "%/managers/base"
import Tag from "%/models/tag"
import siftBySlug from "%/queries/tag/sift_by_slug"

import TagTransformer from "%/transformers/tag"

export default class extends BaseManager<
	Tag,
	TagAttributes<"deserialized">,
	SemesterQueryParameters
> {
	get model(): ModelCtor<Tag> { return Tag }

	get transformer(): TagTransformer { return new TagTransformer() }

	get listPipeline(): Pipe<FindAndCountOptions<Tag>, SemesterQueryParameters>[] {
		return [
			siftBySlug,
			...super.listPipeline
		]
	}
}
