import type { RoleAttributes } from "$/types/documents/role"
import type { CommonConstraints, Pipe } from "$/types/database"
import type { ModelCtor, FindAndCountOptions } from "%/types/dependent"

import Role from "%/models/role"
import BaseManager from "%/managers/base"
import RoleTransformer from "%/transformers/role"
import searchName from "%/managers/helpers/search_name"

export default class extends BaseManager<Role, RoleAttributes> {
	get model(): ModelCtor<Role> { return Role }

	get transformer(): RoleTransformer { return new RoleTransformer() }

	get listPipeline(): Pipe<FindAndCountOptions<Role>, CommonConstraints>[] {
		return [
			searchName,
			...super.listPipeline
		]
	}
}
