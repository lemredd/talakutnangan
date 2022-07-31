import type { CommonConstraints, Pipe } from "$/types/database"
import type { ModelCtor, FindAndCountOptions } from "%/types/dependent"
import type { DepartmentAttributes } from "$/types/documents/department"

import BaseManager from "%/managers/base"
import Department from "%/models/department"
import DepartmentTransformer from "%/transformers/department"

export default class  extends BaseManager<Department, DepartmentAttributes> {
	get model(): ModelCtor<Department> { return Department }

	get transformer(): DepartmentTransformer { return new DepartmentTransformer() }

	get listPipeline(): Pipe<FindAndCountOptions<Department>, CommonConstraints>[] {
		return [
			...super.listPipeline
		]
	}
}
