import type { Request } from "!/types/dependent"
import type {
	EmployeeScheduleDocument,
	EmployeeScheduleListDocument
} from "$/types/documents/employee_schedule"
import type {
	ValidationState,
	ValidationConstraints,
	RestorableEmployeeScheduleConstraints
} from "!/types/validation"

import Manager from "%/managers/employee_schedule"
import archived from "!/validators/manager/archived"
import accessDeepPath from "$!/helpers/access_deep_path"
import makeDeveloperError from "!/validators/make_developer_error"

/**
 * Validator to check if an employee schedule can be restored without conflicting other existing.
 */
export default async function(
	currentState: Promise<ValidationState>,
	constraints: ValidationConstraints<Request> & Partial<RestorableEmployeeScheduleConstraints>
): Promise<ValidationState> {
	const state = await archived(currentState, constraints)

	if (state.maySkip) return state

	if (
		typeof constraints.manager === "undefined"
		|| typeof constraints.restorableEmployeeSchedule === "undefined"
	) {
		throw makeDeveloperError(constraints.field)
	}

	// eslint-disable-next-line new-cap
	const manager = new Manager(
		constraints.request.transaction,
		constraints.request.cache
	)
	const foundModel = await manager.findOneOnColumn(
		constraints.manager.columnName,
		state.value,
		{
			"filter": {
				"existence": "archived"
			}
		}
	) as EmployeeScheduleDocument

	const endTime = foundModel.data.attributes.scheduleEnd
	const startTime = foundModel.data.attributes.scheduleStart
	const userID = accessDeepPath(
		constraints.source, constraints.restorableEmployeeSchedule.userIDPointer
	)

	const foundSchedules = await manager.list({
		"filter": {
			"day": "*",
			"employeeScheduleRange": {
				"end": endTime,
				"start": startTime
			},
			"existence": "exists",
			"user": Number(userID)
		},
		"page": {
			"limit": 1,
			"offset": 0
		},
		"sort": [ "dayName" ]
	}) as EmployeeScheduleListDocument

	if (foundSchedules.data.length === 0) {
		const error = {
			"field": constraints.field,
			"messageMaker": (
				field: string,
				value: string
			) => `The "${field}" with a value of "${value}" conflicts with existing schedules".`
		}

		throw error
	} else {
		return state
	}
}
