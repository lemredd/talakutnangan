import type { Pipe } from "$/types/database"
import type { CommonQueryParameters } from "$/types/query"
import type { ModelCtor, FindAndCountOptions } from "%/types/dependent"
import type { ConsultationAttributes } from "$/types/documents/consultation"

import BaseManager from "%/managers/base"
import Consultation from "%/models/consultation"
import ConsultationTransformer from "%/transformers/consultation"

import includeDefaults from "%/queries/consultation/include_defaults"

export default class extends BaseManager<
	Consultation,
	ConsultationAttributes<"deserialized">,
	CommonQueryParameters
> {
	get model(): ModelCtor<Consultation> { return Consultation }

	get transformer(): ConsultationTransformer { return new ConsultationTransformer() }

	get listPipeline(): Pipe<FindAndCountOptions<Consultation>, CommonQueryParameters>[] {
		return [
			includeDefaults,
			...super.listPipeline
		]
	}
}
