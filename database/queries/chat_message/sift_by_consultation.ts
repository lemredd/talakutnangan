import type { ConsultationFilter } from "$/types/query"
import type { FindOptions, IncludeOptions } from "%/types/dependent"

import Log from "$!/singletons/log"

import Condition from "%/helpers/helpers/condition"
import isUndefined from "$/type_guards/is_undefined"
import ChatMessageActivity from "%/models/chat_message_activity"

/**
 * Sift chat message model which belong to a consultation.
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

	if (isUndefined(newState.include)) {
		newState.include = []
	}

	const castInclude = newState.include as IncludeOptions[]
	castInclude.push({
		"model": ChatMessageActivity,
		"required": true,
		"where": condition.build()
	})

	Log.trace("query pipe", "sift by consultation")

	return newState
}
