import type { CommonQueryParameters } from "$/types/query"
import type { FoundCommentWordAttributes } from "$/types/documents/found_comment_word"
import type {
	ModelCtor
} from "%/types/dependent"

import Model from "%/models/found_comment_word"
import BaseManager from "%/managers/base"
import Condition from "%/helpers/condition"
import Transformer from "%/transformers/found_comment_word"

export default class extends BaseManager<
	Model,
	FoundCommentWordAttributes<"deserialized">,
	CommonQueryParameters
> {
	get model(): ModelCtor<Model> { return Model }

	get transformer(): Transformer { return new Transformer() }

	get exposableColumns(): string[] {
		return []
	}

	async findFoundCommentWord(commentID: number, profanityFilterID: number): Promise<Model|null> {
		try {
			const attachedRole = await Model.findOne({
				"where": new Condition().and(
					new Condition().equal("commentID", commentID),
					new Condition().equal("profanityFilterID", profanityFilterID)
				).build(),
				...this.transaction.transactionObject
			})

			return attachedRole
		} catch (error) {
			throw this.makeBaseError(error)
		}
	}
}
