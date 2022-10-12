import type { Pipe } from "$/types/database"
import type { CommonQueryParameters } from "$/types/query"
import type { CommentVoteAttributes } from "$/types/documents/comment_vote"
import type { ModelCtor, FindAndCountOptions } from "%/types/dependent"

import Model from "%/models/comment_vote"
import BaseManager from "%/managers/base"
import Transformer from "%/transformers/comment_vote"

export default class extends BaseManager<
	Model,
	CommentVoteAttributes<"deserialized">,
	CommonQueryParameters
> {
	get model(): ModelCtor<Model> { return Model }

	get transformer(): Transformer { return new Transformer() }

	get listPipeline(): Pipe<
		FindAndCountOptions<Model>,
		CommonQueryParameters
	>[] {
		return [
			...super.listPipeline
		]
	}

	get exposableColumns(): string[] {
		const excludedColumns = [
			"commentID",
			"userID"
		]
		return super.exposableColumns.filter(columnName => {
			const isIncluded = !excludedColumns.includes(columnName)
			return isIncluded
		})
	}
}
