import type { ModelCtor } from "%/types/dependent"
import type { CommonQueryParameters } from "$/types/query"
import type { EmployeeScheduleAttributes } from "$/types/documents/employee_schedule"

import BaseManager from "%/managers/base"
import EmployeeSchedule from "%/models/employee_schedule"
import EmployeeScheduleTransformer from "%/transformers/employee_schedule"

export default class extends BaseManager<
	EmployeeSchedule,
	EmployeeScheduleAttributes,
	CommonQueryParameters
> {
	get model(): ModelCtor<EmployeeSchedule> { return EmployeeSchedule }

	get transformer(): EmployeeScheduleTransformer { return new EmployeeScheduleTransformer() }
}
