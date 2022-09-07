import type { Pipe } from "$/types/database"
import type { EmployeeScheduleQueryParameters } from "$/types/query"
import type { ModelCtor, FindAndCountOptions } from "%/types/dependent"
import type { EmployeeScheduleAttributes } from "$/types/documents/employee_schedule"

import BaseManager from "%/managers/base"
import EmployeeSchedule from "%/models/employee_schedule"
import siftByDay from "%/queries/employee_schedule/sift_by_day"
import siftByUser from "%/queries/employee_schedule/sift_by_user"
import siftByRange from "%/queries/employee_schedule/sift_by_range"
import EmployeeScheduleTransformer from "%/transformers/employee_schedule"

interface RawEmployeeScheduleAttributes extends EmployeeScheduleAttributes<"serialized"> {
	userID: number
}

export default class extends BaseManager<
	EmployeeSchedule,
	RawEmployeeScheduleAttributes,
	EmployeeScheduleQueryParameters<number>
> {
	get model(): ModelCtor<EmployeeSchedule> { return EmployeeSchedule }

	get transformer(): EmployeeScheduleTransformer { return new EmployeeScheduleTransformer() }

	get exposableColumns(): string[] {
		const excludedColumns = [ "userID" ]
		return super.exposableColumns.filter(columnName => {
			const isIncluded = !excludedColumns.includes(columnName)
			return isIncluded
		})
	}

	get listPipeline(): Pipe<
		FindAndCountOptions<EmployeeSchedule>,
		EmployeeScheduleQueryParameters<number>
	>[] {
		return [
			siftByDay,
			siftByUser,
			siftByRange,
			...super.listPipeline
		]
	}
}
