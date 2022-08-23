import type { ModelCtor } from "%/types/dependent"
import type { CommonQueryParameters } from "$/types/query"
import type { ConsultationAttributes } from "$/types/documents/consultation"

import BaseManager from "%/managers/base"
import Consultation from "%/models/consultation"
import ConsultationTransformer from "%/transformers/consultation"

export default class extends BaseManager<
	Consultation,
	ConsultationAttributes<"deserialized">,
	CommonQueryParameters
> {
	get model(): ModelCtor<Consultation> { return Consultation }

	get transformer(): ConsultationTransformer { return new ConsultationTransformer() }
}
