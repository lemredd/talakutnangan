import type { FindOptions, Model } from "%/types/dependent"

import Log from "$!/singletons/log"
import Condition from "%/managers/helpers/condition"

/**
 * Searches any number of  departments that matches a specific full name.
 */
export default function<T extends Model>(
	currentState: FindOptions<T>,
	constraints: { fullName?: string, [key: string]: any }
): FindOptions<T> {
	const newState = { ...currentState }

	if (constraints.fullName !== undefined) {
		const condition = new Condition()

		condition.search("fullName", constraints.fullName)
		newState.where = {
			...newState.where,
			...condition.build()
		}

		Log.trace("pipeline", "applied full name search filter on query")
	}

	return newState
}
