import type { FindOptions } from "%/types/dependent"

import Log from "$!/singletons/log"

import User from "%/models/user"
import ProfilePicture from "%/models/profile_picture"

/**
 * Includes user data and owned profile picture if there are existing ones.
 */
export default function<T>(
	currentState: FindOptions<T>,
	_constraints: { [key: string]: any }
): FindOptions<T> {
	const newState = { ...currentState }

	if (newState.include === undefined) {
		newState.include = []
	}

	(newState.include as any[])!.push({
		model: User,
		required: false,
		include: [
			{
				model: ProfilePicture,
				required: false
			}
		]
	})

	Log.trace("pipeline", "include user")

	return newState
}
