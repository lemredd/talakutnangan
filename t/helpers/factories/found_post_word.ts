/**
 * @description This module should not be used in production code. It only for testing purposes.
 */
import type { ModelCtor } from "%/types/dependent"
import type { GeneratedData } from "~/types/dependent"
import type {
	FoundPostWordResourceIdentifier,
	FoundPostWordAttributes,
	DeserializedFoundPostWordResource,
	DeserializedFoundPostWordDocument,
	DeserializedFoundPostWordListDocument,
	FoundPostWordResource,
	FoundPostWordDocument,
	FoundPostWordListDocument
} from "$/types/documents/found_post_word"

import ProfanityFilter from "%/models/profanity_filter"
import Post from "%/models/post"
import ProfanityFilterFactory from "~/factories/profanity_filter"
import BaseFactory from "~/factories/base"
import PostFactory from "~/factories/post"
import FoundPostWord from "%/models/found_post_word"
import FoundPostWordTransformer from "%/transformers/found_post_word"

export default class FoundPostWordFactory extends BaseFactory<
	FoundPostWord,
	FoundPostWordResourceIdentifier<"read">,
	FoundPostWordAttributes<"serialized">,
	FoundPostWordAttributes<"deserialized">,
	FoundPostWordResource,
	DeserializedFoundPostWordResource,
	FoundPostWordDocument,
	FoundPostWordListDocument,
	DeserializedFoundPostWordDocument,
	DeserializedFoundPostWordListDocument
> {
	#profanityFilterGenerator: () =>
	Promise<ProfanityFilter> = async() => await new ProfanityFilterFactory().insertOne()

	#postGenerator: () => Promise<Post>
		= async() => await new PostFactory().insertOne()

	get model(): ModelCtor<FoundPostWord> { return FoundPostWord }

	get transformer(): FoundPostWordTransformer { return new FoundPostWordTransformer() }

	async generate(): GeneratedData<FoundPostWord> {
		return {
			"postID": (await this.#postGenerator()).id,
			"profanityFilterID": (await this.#profanityFilterGenerator()).id
		}
	}

	async attachRelatedModels(model: FoundPostWord): Promise<FoundPostWord> {
		model.post = await Post.findByPk(model.postID) as Post
		model.profanityFilter = await ProfanityFilter.findByPk(
			model.profanityFilterID) as ProfanityFilter

		return model
	}

	profanityFilter(generator: () => Promise<ProfanityFilter>): FoundPostWordFactory {
		this.#profanityFilterGenerator = generator
		return this
	}

	post(generator: () => Promise<Post>): FoundPostWordFactory {
		this.#postGenerator = generator
		return this
	}
}
