import type { FindOptions, Model } from "%/types/dependent"

import Log from "$!/singletons/log"

/**
 * Skips any number of model to retrieve from database.
 */
export default function<T extends Model>(
	currentState: FindOptions<T>,
	constraints: { page?: number, [key: string]: any }
): FindOptions<T> {
	const newState = { ...currentState }

	if (constraints.page !== undefined) {
		newState.offset = constraints.page

		Log.trace("pipeline", "applied offset on query")
	}

	return newState
}
