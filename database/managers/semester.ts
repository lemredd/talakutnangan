import type { Pipe } from "$/types/database"
import type { SemesterQueryParameters } from "$/types/query"
import type { FindAndCountOptions, ModelCtor } from "%/types/dependent"
import type { SemesterAttributes } from "$/types/documents/semester"

import Model from "%/models/semester"
import BaseManager from "%/managers/base"
import siftBySlug from "%/queries/semester/sift_by_slug"

import SemesterTransformer from "%/transformers/semester"

export default class extends BaseManager<
	Model,
	SemesterAttributes<"deserialized">,
	SemesterQueryParameters
> {
	get model(): ModelCtor<Model> { return Model }

	get transformer(): SemesterTransformer { return new SemesterTransformer() }

	get listPipeline(): Pipe<FindAndCountOptions<Model>, SemesterQueryParameters>[] {
		return [
			siftBySlug,
			...super.listPipeline
		]
	}
}
