import type { ConsultationFilter } from "$/types/query"
import type { FindOptions, IncludeOptions } from "%/types/dependent"

import Log from "$!/singletons/log"

import Condition from "%/managers/helpers/condition"
import isUndefined from "$/helpers/type_guards/is_undefined"
import ChatMessageActivity from "%/models/chat_message_activity"

/**
 * Sift consultation model which belong to a certain user based on chat activity.
 */
export default function<T>(
	currentState: FindOptions<T>,
	constraints: Partial<ConsultationFilter<number>>
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
	condition.and(
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
