import type { ModelCtor } from "%/types/dependent"
import type { GeneratedData } from "~/types/dependent"
import type {
	ProfanityFilterResourceIdentifier,
	ProfanityFilterAttributes,
	DeserializedProfanityFilterResource,
	DeserializedProfanityFilterDocument,
	DeserializedProfanityFilterListDocument,
	ProfanityFilterResource,
	ProfanityFilterDocument,
	ProfanityFilterListDocument
} from "$/types/documents/profanity_filter"

import { faker } from "@faker-js/faker"

import ProfanityFilter from "%/models/profanity_filter"
import BaseFactory from "~/factories/base"
import ProfanityFilterTransformer from "%/transformers/profanity_filter"

export default class ProfanityFilterFactory extends BaseFactory<
	ProfanityFilter,
	ProfanityFilterResourceIdentifier,
	ProfanityFilterAttributes<"serialized">,
	ProfanityFilterAttributes<"deserialized">,
	ProfanityFilterResource,
	DeserializedProfanityFilterResource,
	ProfanityFilterDocument,
	ProfanityFilterListDocument,
	DeserializedProfanityFilterDocument,
	DeserializedProfanityFilterListDocument
> {
	#word: () => string = () => faker.random.word() + faker.random.word()
	get model(): ModelCtor<ProfanityFilter> { return ProfanityFilter }

	get transformer(): ProfanityFilterTransformer { return new ProfanityFilterTransformer() }

	generate(): GeneratedData<ProfanityFilter> {
		return Promise.resolve({
			"word": this.#word()
		})
	}

	word(word: () => string): ProfanityFilterFactory {
		this.#word = word
		return this
	}
}
