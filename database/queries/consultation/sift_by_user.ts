import type { UserFilter } from "$/types/query"
import type { FindOptions, IncludeOptions } from "%/types/dependent"

import Log from "$!/singletons/log"

import Condition from "%/helpers/helpers/condition"
import ChatMessageActivity from "%/models/chat_message_activity"

/**
 * Sift consultation model which belong to a certain user based on chat activity.
 */
export default function<T>(
	currentState: FindOptions<T>,
	constraints: UserFilter<number>
): FindOptions<T> {
	const newState = { ...currentState }

	const condition = new Condition()
	condition.equal("userID", constraints.filter.user)

	if (typeof newState.include === "undefined") {
		newState.include = []
	}

	const castInclude = newState.include as IncludeOptions[]
	castInclude.push({
		"model": ChatMessageActivity,
		"required": true,
		"where": condition.build()
	})

	Log.trace("pipeline", "sift by user")

	return newState
}
