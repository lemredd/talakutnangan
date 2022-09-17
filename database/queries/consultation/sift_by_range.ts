import type { FindOptions } from "%/types/dependent"
import type { ConsultationRangeFilter } from "$/types/query"

import Log from "$!/singletons/log"

import Condition from "%/helpers/condition"

/**
 * Sift employee schedule models which within a certain range.
 */
export default function<T>(
	currentState: FindOptions<T>,
	constraints: ConsultationRangeFilter
): FindOptions<T> {
	const newState = { ...currentState }

	const { consultationScheduleRange } = constraints.filter

	if (typeof newState.where === "undefined") {
		newState.where = {}
	}

	const condition = new Condition()

	if (consultationScheduleRange !== "*") {
		condition.and(
			new Condition().greaterThanOrEqual("scheduledStartAt", consultationScheduleRange.start),
			new Condition().lessThanOrEqual("scheduledStartAt", consultationScheduleRange.end)
		)
	}

	newState.where = new Condition().and(
		new Condition(newState.where),
		condition
	).build()

	Log.trace("pipeline", "sift by range")

	return newState
}
