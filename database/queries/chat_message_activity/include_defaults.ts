import type { FindOptions, IncludeOptions } from "%/types/dependent"

import Log from "$!/singletons/log"

import User from "%/models/user"
import Consultation from "%/models/consultation"
import ProfilePicture from "%/models/profile_picture"
import isUndefined from "$/type_guards/is_undefined"

/**
 * Includes default models
 */
export default function<T>(
	currentState: FindOptions<T>,
	unusedConstraints: { [key: string]: any }
): FindOptions<T> {
	const newState = { ...currentState }

	if (isUndefined(newState.include)) {
		newState.include = []
	}

	const castInclude = newState.include as IncludeOptions[]
	castInclude.push({
		"include": [
			{
				"model": ProfilePicture,
				"required": false
			}
		],
		"model": User,
		"required": true
	}, {
		"model": Consultation,
		"required": true
	})

	Log.trace("query pipe", "applied default includer")

	return newState
}
