import type { ModelCtor, FindAndCountOptions } from "%/types/dependent"
import type { CommonConstraints, RawRole, Pipe } from "%/types/independent"

import Role from "%/models/role"
import BaseManager from "%/managers/base"
import limit from "%/managers/helpers/limit"
import offset from "%/managers/helpers/offset"
import search_name from "%/managers/helpers/search_name"

export default class extends BaseManager<Role, RawRole> {
	get model(): ModelCtor<Role> { return Role }

	get listPipeline(): Pipe<FindAndCountOptions<Role>, CommonConstraints>[] {
		return [
			search_name,
			offset,
			limit
		]
	}
}
