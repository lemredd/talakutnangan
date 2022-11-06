import type { Pipe } from "$/types/database"
import type { TagQueryParameters } from "$/types/query"
import type { TagAttributes } from "$/types/documents/tag"
import type { FindAndCountOptions, ModelCtor } from "%/types/dependent"

import Model from "%/models/tag"
import BaseManager from "%/managers/base"
import Transformer from "%/transformers/tag"
import siftBySlug from "%/queries/tag/sift_by_slug"
import includeDefaults from "%/queries/tag/include_defaults"

export default class extends BaseManager<
	Model,
	TagAttributes<"deserialized">,
	TagQueryParameters
> {
	get model(): ModelCtor<Model> { return Model }

	get transformer(): Transformer { return new Transformer() }

	get singleReadPipeline(): Pipe<FindAndCountOptions<Model>, TagQueryParameters>[] {
		return [
			includeDefaults,
			...super.singleReadPipeline
		]
	}

	get listPipeline(): Pipe<FindAndCountOptions<Model>, TagQueryParameters>[] {
		return [
			siftBySlug,
			includeDefaults,
			...super.listPipeline
		]
	}
}
