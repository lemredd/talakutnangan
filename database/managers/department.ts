import type { ModelCtor, FindAndCountOptions } from "%/types/dependent"
import type { CommonConstraints, RawDepartment, Pipe } from "%/types/independent"

import BaseManager from "%/managers/base"
import Department from "%/models/department"
import limit from "%/managers/helpers/limit"
import offset from "%/managers/helpers/offset"
import search_name from "%/managers/helpers/search_name"

export default class  extends BaseManager<Department, RawDepartment> {
	get model(): ModelCtor<Department> { return Department }

	get listPipeline(): Pipe<FindAndCountOptions<Department>, CommonConstraints>[] {
		return [
			search_name,
			offset,
			limit
		]
	}
}
