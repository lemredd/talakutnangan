import type { KindFilter } from "$/types/query"
import type { FindOptions } from "%/types/dependent"

import Log from "$!/singletons/log"

import Condition from "%/managers/helpers/condition"

/**
 * Sift user models which is a certain kind.
 */
export default function<T>(
	currentState: FindOptions<T>,
	constraints: KindFilter
): FindOptions<T> {
	const newState = { ...currentState }

	switch(constraints.filter.kind) {
		case "*":
			// do nothing
			break
		default:
			const condition = new Condition()
			condition.equal("kind", constraints.filter.kind)

			if (newState.where === undefined) {
				newState.where = {}
			}

			newState.where = {
				...newState.where,
				...condition.build()
			}
			break
	}

	Log.trace("pipeline", "sift by kind")

	return newState
}
