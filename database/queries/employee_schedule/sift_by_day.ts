import type { FindOptions } from "%/types/dependent"
import type { EmployeeScheduleDayFilter } from "$/types/query"

import Log from "$!/singletons/log"

import Condition from "%/helpers/condition"
import isUndefined from "$/type_guards/is_undefined"

/**
 * Sift employee schedule models which within a certain day.
 */
export default function<T>(
	currentState: FindOptions<T>,
	constraints: EmployeeScheduleDayFilter
): FindOptions<T> {
	const newState = { ...currentState }

	const { day } = constraints.filter

	if (isUndefined(newState.where)) {
		newState.where = {}
	}

	const condition = new Condition()

	if (day !== "*") {
		condition.equal("dayName", day)
	}

	newState.where = new Condition().and(
		new Condition(newState.where),
		condition
	).build()

	Log.trace("pipeline", "sift by day")

	return newState
}
