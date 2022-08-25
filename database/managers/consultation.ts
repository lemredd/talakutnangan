import type { Pipe } from "$/types/database"
import type { CommonQueryParameters } from "$/types/query"
import type { ModelCtor, FindAndCountOptions } from "%/types/dependent"
import type { ConsultationAttributes } from "$/types/documents/consultation"

import BaseManager from "%/managers/base"
import Model from "%/models/consultation"
import Transformer from "%/transformers/consultation"

import includeDefaults from "%/queries/consultation/include_defaults"

export default class extends BaseManager<
	Model,
	ConsultationAttributes<"deserialized">,
	CommonQueryParameters
> {
	get model(): ModelCtor<Model> { return Model }

	get transformer(): Transformer { return new Transformer() }

	get listPipeline(): Pipe<FindAndCountOptions<Model>, CommonQueryParameters>[] {
		return [
			includeDefaults,
			...super.listPipeline
		]
	}
}
