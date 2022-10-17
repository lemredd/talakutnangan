import type { CommonQueryParameters } from "$/types/query"
import type { PostTagAttributes } from "$/types/documents/post_tag"
import type {
	ModelCtor
} from "%/types/dependent"

import Model from "%/models/post_tag"
import BaseManager from "%/managers/base"
import Condition from "%/helpers/condition"
import Transformer from "%/transformers/post_tag"

export default class extends BaseManager<
	Model,
	PostTagAttributes<"deserialized">,
	CommonQueryParameters
> {
	get model(): ModelCtor<Model> { return Model }

	get transformer(): Transformer { return new Transformer() }

	get exposableColumns(): string[] {
		return []
	}

	async findPostTag(postID: number, tagID: number): Promise<Model|null> {
		try {
			const attachedPost = await Model.findOne({
				"where": new Condition().and(
					new Condition().equal("postID", postID),
					new Condition().equal("tagID", tagID)
				).build(),
				...this.transaction.transactionObject
			})

			return attachedPost
		} catch (error) {
			throw this.makeBaseError(error)
		}
	}
}
