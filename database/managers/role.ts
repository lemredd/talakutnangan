import type { ModelCtor, FindAndCountOptions } from "%/types/dependent"
import type { CommonConstraints, RawRole, Pipe } from "$/types/database"

import Role from "%/models/role"
import BaseManager from "%/managers/base"
import limit from "%/managers/helpers/limit"
import offset from "%/managers/helpers/offset"
import RoleTransformer from "%/transformers/role"
import searchName from "%/managers/helpers/search_name"

export default class extends BaseManager<Role, RawRole> {
	get model(): ModelCtor<Role> { return Role }

	get transformer(): RoleTransformer { return new RoleTransformer() }

	get listPipeline(): Pipe<FindAndCountOptions<Role>, CommonConstraints>[] {
		return [
			searchName,
			offset,
			limit
		]
	}
}
