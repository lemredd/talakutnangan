import type { ModelCtor, FindAndCountOptions } from "%/types/dependent"
import type { CommonConstraints, RawDepartment, Pipe } from "$/types/database"

import BaseManager from "%/managers/base"
import Department from "%/models/department"
import limit from "%/managers/helpers/limit"
import offset from "%/managers/helpers/offset"
import DepartmentTransformer from "%/transformers/department"
import searchFullname from "%/managers/department/search_fullname"

export default class  extends BaseManager<Department, RawDepartment> {
	get model(): ModelCtor<Department> { return Department }

	get transformer(): DepartmentTransformer { return new DepartmentTransformer() }

	get listPipeline(): Pipe<FindAndCountOptions<Department>, CommonConstraints>[] {
		return [
			searchFullname,
			offset,
			limit
		]
	}
}
