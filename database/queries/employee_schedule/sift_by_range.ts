import type { FindOptions } from "%/types/dependent"
import type { EmployeeScheduleRangeFilter } from "$/types/query"

import Log from "$!/singletons/log"

import Condition from "%/helpers/condition"
import isUndefined from "$/type_guards/is_undefined"

/**
 * Sift employee schedule models which within a certain range.
 */
export default function<T>(
	currentState: FindOptions<T>,
	constraints: EmployeeScheduleRangeFilter
): FindOptions<T> {
	const newState = { ...currentState }

	const { employeeScheduleRange } = constraints.filter

	if (isUndefined(newState.where)) {
		newState.where = {}
	}

	const condition = new Condition()

	if (employeeScheduleRange !== "*") {
		condition.and(
			new Condition().greaterThanOrEqual("scheduleStart", employeeScheduleRange.start),
			new Condition().lessThanOrEqual("scheduleEnd", employeeScheduleRange.end)
		)
	}

	newState.where = new Condition().and(
		new Condition(newState.where),
		condition
	).build()

	Log.trace("pipeline", "sift by range")

	return newState
}
