import type { FindOptions } from "%/types/dependent"
import type { ConsultationFilter } from "$/types/query"

import Log from "$!/singletons/log"

import Condition from "%/helpers/helpers/condition"
import isUndefined from "$/type_guards/is_undefined"

/**
 * Sift chat message activity model which belong to a consultation.
 */
export default function<T>(
	currentState: FindOptions<T>,
	constraints: ConsultationFilter<number>|Partial<ConsultationFilter<number>>
): FindOptions<T> {
	const newState = { ...currentState }

	if (
		isUndefined(constraints.filter)
		|| isUndefined(constraints.filter.consultationIDs)
		|| constraints.filter.consultationIDs.length === 0
	) {
		return currentState
	}

	const condition = new Condition()
	condition.or(
		...constraints.filter.consultationIDs.map(
			consultationID => new Condition().equal("consultationID", consultationID)
		)
	)

	if (isUndefined(newState.where)) {
		newState.where = {}
	}

	newState.where = new Condition().and(
		new Condition(newState.where),
		condition
	).build()

	Log.trace("query pipe", "sift by consultation")

	return newState
}
