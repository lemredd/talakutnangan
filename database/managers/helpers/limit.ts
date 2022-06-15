import type { FindOptions, Model } from "%/types/dependent"

import Log from "!/helpers/log"

/**
 * Limits the number of models to retrieve from database.
 */
export default function<T extends Model>(
	currentState: FindOptions<T>,
	constraints: { limit?: number, [key: string]: any }
): FindOptions<T> {
	const newState = { ...currentState }

	if (constraints.limit !== undefined) {
		newState.limit = constraints.limit

		Log.trace("pipeline", "applied limit on query")
	}

	return newState
}
