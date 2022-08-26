import type { Pipe } from "$/types/database"
import type { ConsultationQueryParameters } from "$/types/query"
import type { ModelCtor, FindAndCountOptions } from "%/types/dependent"
import type { ConsultationAttributes } from "$/types/documents/consultation"

import BaseManager from "%/managers/base"
import Model from "%/models/consultation"
import Transformer from "%/transformers/consultation"

import siftByUser from "%/queries/consultation/sift_by_user"
import includeDefaults from "%/queries/consultation/include_defaults"

export default class extends BaseManager<
	Model,
	ConsultationAttributes<"deserialized">,
	ConsultationQueryParameters<number>
> {
	get model(): ModelCtor<Model> { return Model }

	get transformer(): Transformer { return new Transformer() }

	get listPipeline(): Pipe<FindAndCountOptions<Model>, ConsultationQueryParameters<number>>[] {
		return [
			siftByUser,
			includeDefaults,
			...super.listPipeline
		]
	}
}
