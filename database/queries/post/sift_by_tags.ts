import type { TagFilter } from "$/types/query"
import type { FindOptions, IncludeOptions } from "%/types/dependent"

import Log from "$!/singletons/log"

import Condition from "%/helpers/condition"
import isUndefined from "$/type_guards/is_undefined"

import Tag from "%/models/tag"

/**
 * Sift post models which are associated to a certain tag(s).
 */
export default function<T>(
	currentState: FindOptions<T>,
	constraints: TagFilter<number>
): FindOptions<T> {
	const newState = { ...currentState }

	if (constraints.filter.tagIDs !== "*") {
		const condition = new Condition()

		condition.isIncludedIn("id", constraints.filter.tagIDs)

		if (isUndefined(newState.include)) {
			newState.include = []
		}

		const castInclude = newState.include as IncludeOptions[]

		castInclude.push({
			"model": Tag,
			"required": true,
			"where": condition.build()
		})
	}


	Log.trace("pipeline", "sift by tags")

	return newState
}
