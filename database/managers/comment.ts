import type { ModelCtor } from "%/types/dependent"
import type { CommonQueryParameters } from "$/types/query"
import type { CommentAttributes } from "$/types/documents/comment"

import Model from "%/models/comment"
import BaseManager from "%/managers/base"
import Transformer from "%/transformers/comment"

export default class extends BaseManager<
	Model,
	CommentAttributes<"deserialized">,
	CommonQueryParameters
> {
	get model(): ModelCtor<Model> { return Model }

	get transformer(): Transformer { return new Transformer() }

	get exposableColumns(): string[] {
		const excludedColumns = [
			"approvedAt",
			"userID",
			"postID",
			"parentCommentID",
			"commentID",
			"deletedAt"
		]
		return super.exposableColumns.filter(columnName => {
			const isIncluded = !excludedColumns.includes(columnName)
			return isIncluded
		})
	}
}
