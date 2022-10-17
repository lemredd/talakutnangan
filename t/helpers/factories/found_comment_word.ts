/**
 * @description This module should not be used in production code. It only for testing purposes.
 */
import type { ModelCtor } from "%/types/dependent"
import type { GeneratedData } from "~/types/dependent"
import type {
	FoundCommentWordResourceIdentifier,
	FoundCommentWordAttributes,
	DeserializedFoundCommentWordResource,
	DeserializedFoundCommentWordDocument,
	DeserializedFoundCommentWordListDocument,
	FoundCommentWordResource,
	FoundCommentWordDocument,
	FoundCommentWordListDocument
} from "$/types/documents/found_comment_word"

import ProfanityFilter from "%/models/profanity_filter"
import Comment from "%/models/comment"
import ProfanityFilterFactory from "~/factories/profanity_filter"
import BaseFactory from "~/factories/base"
import CommentFactory from "~/factories/comment"
import FoundCommentWord from "%/models/found_comment_word"
import FoundCommentWordTransformer from "%/transformers/found_comment_word"

export default class FoundCommentWordFactory extends BaseFactory<
	FoundCommentWord,
	FoundCommentWordResourceIdentifier<"read">,
	FoundCommentWordAttributes<"serialized">,
	FoundCommentWordAttributes<"deserialized">,
	FoundCommentWordResource,
	DeserializedFoundCommentWordResource,
	FoundCommentWordDocument,
	FoundCommentWordListDocument,
	DeserializedFoundCommentWordDocument,
	DeserializedFoundCommentWordListDocument
> {
	#profanityFilterGenerator:
	() => Promise<ProfanityFilter> = async() => await new ProfanityFilterFactory().insertOne()

	#commentGenerator: () => Promise<Comment>
		= async() => await new CommentFactory().insertOne()

	get model(): ModelCtor<FoundCommentWord> { return FoundCommentWord }

	get transformer(): FoundCommentWordTransformer { return new FoundCommentWordTransformer() }

	async generate(): GeneratedData<FoundCommentWord> {
		return {
			"commentID": (await this.#commentGenerator()).id,
			"profanityFilterID": (await this.#profanityFilterGenerator()).id
		}
	}

	async attachRelatedModels(model: FoundCommentWord): Promise<FoundCommentWord> {
		model.comment = await Comment.findByPk(model.commentID) as Comment
		model.profanityFilter = await ProfanityFilter.findByPk(
			model.profanityFilterID) as ProfanityFilter

		return model
	}

	profanityFilter(generator: () => Promise<ProfanityFilter>): FoundCommentWordFactory {
		this.#profanityFilterGenerator = generator
		return this
	}

	comment(generator: () => Promise<Comment>): FoundCommentWordFactory {
		this.#commentGenerator = generator
		return this
	}
}
