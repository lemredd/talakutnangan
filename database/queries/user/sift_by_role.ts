import type { RoleFilter } from "$/types/query"
import type { FindOptions } from "%/types/dependent"

import Log from "$!/singletons/log"

import Role from "%/models/role"
import Condition from "%/managers/helpers/condition"

/**
 * Sift user model which has a certain role.
 */
export default function<T>(
	currentState: FindOptions<T>,
	constraints: RoleFilter<number>
): FindOptions<T> {
	const newState = { ...currentState }

	switch (constraints.filter.role) {
		case "*":
			// Do nothing
			break
		default: {
			const condition = new Condition()
			condition.equal("id", constraints.filter.role)

			if (!newState.include) {
				newState.include = []
			}

			(newState.include as any[])!.push({
				"model": Role,
				"required": true,
				"where": condition.build()
			})
			break
		}
	}

	Log.trace("pipeline", "sift by role")

	return newState
}
