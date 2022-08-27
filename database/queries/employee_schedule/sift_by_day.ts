import type { FindOptions } from "%/types/dependent"
import type { EmployeeScheduleDayFilter } from "$/types/query"

import Log from "$!/singletons/log"

import Condition from "%/managers/helpers/condition"

/**
 * Sift employee schedule models which within a certain day.
 */
export default function<T>(
	currentState: FindOptions<T>,
	constraints: EmployeeScheduleDayFilter
): FindOptions<T> {
	const newState = { ...currentState }

	const { day } = constraints.filter

	if (typeof newState.where === "undefined") {
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
