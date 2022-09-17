import type { ChatMessageKindFilter } from "$/types/query"
import type { FindOptions } from "%/types/dependent"

import Log from "$!/singletons/log"

import Condition from "%/managers/helpers/condition"
import isUndefined from "$/type_guards/is_undefined"

/**
 * Sift chat message model by kinds
 */
export default function<T>(
	currentState: FindOptions<T>,
	constraints: ChatMessageKindFilter|Partial<ChatMessageKindFilter>
): FindOptions<T> {
	const newState = { ...currentState }

	if (
		isUndefined(constraints.filter)
		|| isUndefined(constraints.filter.chatMessageKinds)
		|| constraints.filter.chatMessageKinds === "*"
	) {
		return currentState
	}

	const condition = new Condition()
	condition.or(
		...constraints.filter.chatMessageKinds.map(
			kind => new Condition().equal("kind", kind)
		)
	)

	if (isUndefined(newState.where)) {
		newState.where = {}
	}

	newState.where = new Condition().and(
		new Condition(newState.where),
		condition
	).build()

	Log.trace("query pipe", "sift by kinds")

	return newState
}
