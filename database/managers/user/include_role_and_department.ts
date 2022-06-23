import type { FindOptions } from "%/types/dependent"

import Log from "!/helpers/log"

import Role from "%/models/role"
import Department from "%/models/department"

/**
 * Includes role and department models upon getting user models
 */
export default function<T>(
	currentState: FindOptions<T>,
	_constraints: { [key: string]: any }
): FindOptions<T> {
	const newState = { ...currentState }

	if (newState.include === undefined) {
		newState.include = []
	}

	(newState.include as any[])!.push(Role, Department)

	Log.trace("pipeline", "applied role and department includer")

	return newState
}
