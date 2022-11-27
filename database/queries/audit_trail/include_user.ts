import type { FindOptions, IncludeOptions } from "%/types/dependent"

import Log from "$!/singletons/log"

import User from "%/models/user"
import isUndefined from "$/type_guards/is_undefined"
import ProfilePicture from "%/models/profile_picture"

/**
 * Includes user data and owned profile picture if there are existing ones.
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
		"paranoid": false,
		"required": false
	})

	Log.trace("pipeline", "include user")

	return newState
}
