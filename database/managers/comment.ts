import type { Pipe } from "$/types/database"
import type { CommentQueryParameters } from "$/types/query"
import type { CommentAttributes } from "$/types/documents/comment"
import type { ModelCtor, FindAndCountOptions } from "%/types/dependent"

import Model from "%/models/comment"
import BaseManager from "%/managers/base"
import Transformer from "%/transformers/comment"
import siftByPost from "%/queries/comment/sift_by_post"
import includeDefaults from "%/queries/comment/include_defaults"

export default class extends BaseManager<
	Model,
	CommentAttributes<"deserialized">,
	CommentQueryParameters<number>
> {
	get model(): ModelCtor<Model> { return Model }

	get transformer(): Transformer { return new Transformer() }

	get listPipeline(): Pipe<
		FindAndCountOptions<Model>,
		CommentQueryParameters<number>
	>[] {
		return [
			siftByPost,
			includeDefaults,
			...super.listPipeline
		]
	}

	get exposableColumns(): string[] {
		const excludedColumns = [
			"approvedAt",
			"userID",
			"postID",
			"commentID",
			"deletedAt"
		]
		return super.exposableColumns.filter(columnName => {
			const isIncluded = !excludedColumns.includes(columnName)
			return isIncluded
		})
	}
}
