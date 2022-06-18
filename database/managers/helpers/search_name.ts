import type { FindOptions, Model } from "%/types/dependent"

import Log from "!/helpers/log"
import Condition from "%/managers/helpers/condition"

/**
 * Searches any number of models that matches a specific name.
 */
export default function<T extends Model>(
	currentState: FindOptions<T>,
	constraints: { name?: string, [key: string]: any }
): FindOptions<T> {
	const newState = { ...currentState }

	if (constraints.name !== undefined) {
		const condition = new Condition()

		condition.search("name", constraints.name)
		newState.where = {
			...newState.where,
			...condition.build()
		}

		Log.trace("pipeline", "applied name search filter on query")
	}

	return newState
}
