import type { FindOptions } from "%/types/dependent"
import type { UserFilter } from "$/types/query"

import Log from "$!/singletons/log"

import User from "%/models/user"
import Condition from "%/helpers/helpers/condition"

/**
 * Sift employee schedule model which belong to a certain user.
 */
export default function<T>(
	currentState: FindOptions<T>,
	constraints: UserFilter<number>
): FindOptions<T> {
	const newState = { ...currentState }

	const condition = new Condition()
	condition.equal("id", constraints.filter.user)

	if (!newState.include) {
		newState.include = []
	}

	(newState.include as any[])!.push({
		"model": User,
		"required": true,
		"where": condition.build()
	})

	Log.trace("pipeline", "sift by user")

	return newState
}
