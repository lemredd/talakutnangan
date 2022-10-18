import type { SlugFilter } from "$/types/query"
import type { FindOptions } from "%/types/dependent"

import Log from "$!/singletons/log"

import Condition from "%/helpers/condition"
import isUndefined from "$/type_guards/is_undefined"

/**
 * Sift user model which matches a certain column.
 */
export default function<T>(
	currentState: FindOptions<T>,
	constraints: SlugFilter
): FindOptions<T> {
	const newState = { ...currentState }

	switch (constraints.filter.slug) {
		case "":
			// Do nothing
			break
		default: {
			const condition = new Condition()
			condition.or(
				new Condition().search("name", constraints.filter.slug)
			)

			if (isUndefined(newState.where)) {
				newState.where = {}
			}

			newState.where = {
				...newState.where,
				...condition.build()
			}
			break
		}
	}

	Log.trace("pipeline", "sift by slug")

	return newState
}
