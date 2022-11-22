import type { CommonQueryParameters } from "$/types/query"
import type { ModelCtor } from "%/types/dependent"
import type { ProfanityFilterAttributes } from "$/types/documents/profanity_filter"

import BaseManager from "%/managers/base"
import ProfanityFilter from "%/models/profanity_filter"

import ProfanityFilterTransformer from "%/transformers/profanity_filter"

export default class extends BaseManager<
	ProfanityFilter,
	ProfanityFilterAttributes<"deserialized">,
	CommonQueryParameters
> {
	get model(): ModelCtor<ProfanityFilter> { return ProfanityFilter }

	get transformer(): ProfanityFilterTransformer { return new ProfanityFilterTransformer() }
}
