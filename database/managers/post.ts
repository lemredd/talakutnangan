import type { CommonQueryParameters } from "$/types/query"
import type { PostAttributes } from "$/types/documents/post"
import type { Model as BaseModel, ModelCtor } from "%/types/dependent"

import User from "%/models/user"
import Model from "%/models/post"
import BaseManager from "%/managers/base"
import Transformer from "%/transformers/post"
import AttachedRole from "%/models/attached_role"

export default class extends BaseManager<
	Model,
	PostAttributes<"deserialized">,
	CommonQueryParameters
> {
	get model(): ModelCtor<Model> { return Model }

	get transformer(): Transformer { return new Transformer() }

	get exposableColumns(): string[] {
		const excludedColumns = [ "approvedAt", "attachedRoleID", "deletedAt" ]
		return super.exposableColumns.filter(columnName => {
			const isIncluded = !excludedColumns.includes(columnName)
			return isIncluded
		})
	}

	get modelChainToUser(): readonly ModelCtor<BaseModel>[] {
		return [
			AttachedRole,
			User
		]
	}
}
