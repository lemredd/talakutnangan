import type { FindOptions } from "%/types/dependent"
import type { DateTimeRangeFilter } from "$/types/query"

import Log from "$!/singletons/log"

import Condition from "%/helpers/condition"
import isUndefined from "$/type_guards/is_undefined"

/**
 * Sift post models which within a certain range.
 */
export default function<T>(
	currentState: FindOptions<T>,
	constraints: DateTimeRangeFilter
): FindOptions<T> {
	const newState = { ...currentState }

	const { dateTimeRange } = constraints.filter

	if (isUndefined(newState.where)) {
		newState.where = {}
	}

	const condition = new Condition()
	condition.and(
		new Condition().greaterThanOrEqual("createdAt", dateTimeRange.begin),
		new Condition().lessThanOrEqual("createdAt", dateTimeRange.end)
	)

	newState.where = new Condition().and(
		new Condition(newState.where),
		condition
	).build()

	Log.trace("pipeline", "sift by range")

	return newState
}
