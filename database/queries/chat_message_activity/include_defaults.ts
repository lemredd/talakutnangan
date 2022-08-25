import type { FindOptions, IncludeOptions } from "%/types/dependent"

import Log from "$!/singletons/log"

import User from "%/models/user"
import Consultation from "%/models/consultation"

/**
 * Includes default models
 */
export default function<T>(
	currentState: FindOptions<T>,
	unusedConstraints: { [key: string]: any }
): FindOptions<T> {
	const newState = { ...currentState }

	if (typeof newState.include === "undefined") {
		newState.include = []
	}

	const castInclude = newState.include as IncludeOptions[]
	castInclude.push({
		"model": Consultation,
		"required": true
	}, {
		"model": User,
		"required": true
	})

	Log.trace("pipeline", "applied default includer")

	return newState
}
