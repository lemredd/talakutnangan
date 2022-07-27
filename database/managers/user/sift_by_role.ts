import type { RoleFilter } from "$/types/database"
import type { FindOptions } from "%/types/dependent"

import Log from "$!/singletons/log"

import Role from "%/models/role"
import AttachedRole from "%/models/attached_role"
import Condition from "%/managers/helpers/condition"

/**
 * Sift user model which has a certain role.
 */
export default function<T>(
	currentState: FindOptions<T>,
	constraints: RoleFilter
): FindOptions<T> {
	const newState = { ...currentState }

	switch(constraints.filter.role) {
		case "*":
			// do nothing
			break
		default:
			const condition = new Condition()
			condition.equal("name", constraints.filter.role)

			if (newState.include === undefined) {
				newState.include = []
			}

			(newState.include as any[])!.push({
				model: Role,
				required: true,
				where: condition.build()
			})
			break
	}

	Log.trace("pipeline", "sift by role")

	return newState
}
