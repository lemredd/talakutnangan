import type { Pipe } from "$/types/database"
import type { EmployeeScheduleQueryParameters } from "$/types/query"
import type { ModelCtor, FindAndCountOptions } from "%/types/dependent"
import type { EmployeeScheduleAttributes } from "$/types/documents/employee_schedule"

import BaseManager from "%/managers/base"
import EmployeeSchedule from "%/models/employee_schedule"
import siftByUser from "%/queries/employee_schedule/sift_by_user"
import EmployeeScheduleTransformer from "%/transformers/employee_schedule"

export default class extends BaseManager<
	EmployeeSchedule,
	EmployeeScheduleAttributes<number>,
	EmployeeScheduleQueryParameters
> {
	get model(): ModelCtor<EmployeeSchedule> { return EmployeeSchedule }

	get transformer(): EmployeeScheduleTransformer { return new EmployeeScheduleTransformer() }

	get listPipeline(): Pipe<
		FindAndCountOptions<EmployeeSchedule>,
		EmployeeScheduleQueryParameters<number>
	>[] {
		return [
			siftByUser,
			...super.listPipeline
		]
	}
}
