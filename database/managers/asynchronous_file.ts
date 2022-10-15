import type { ModelCtor } from "%/types/dependent"
import type { GeneralObject } from "$/types/general"
import type { FileLikeTransformerOptions } from "%/types/independent"
import type { AsynchronousFileAttributes } from "$/types/documents/asynchronous_file"

import BaseManager from "%/managers/base"
import Model from "%/models/asynchronous_file"
import Transformer from "%/transformers/asynchronous_file"

export default class extends BaseManager<
	Model,
	AsynchronousFileAttributes<"raw">,
	GeneralObject,
	FileLikeTransformerOptions
> {
	get model(): ModelCtor<Model> { return Model }

	get transformer(): Transformer { return new Transformer() }

	protected get exposableColumns(): string[] {
		const excludedColumns = new Set([ "id", "userID" ])
		return super.exposableColumns.filter(columnName => !excludedColumns.has(columnName))
	}
}
