import type { FindOptions } from "%/types/dependent"
import type { PostFilter } from "$/types/query"

import Log from "$!/singletons/log"

import Condition from "%/helpers/condition"
import isUndefined from "$/type_guards/is_undefined"

/**
 * Sift comment models which are associated to a certain post.
 */
export default function<T>(
	currentState: FindOptions<T>,
	constraints: PostFilter<number>
): FindOptions<T> {
	const newState = { ...currentState }

	const condition = new Condition()
	condition.equal("postID", constraints.filter.postID)

	if (isUndefined(newState.where)) {
		newState.where = {}
	}

	newState.where = new Condition().and(
		new Condition(newState.where),
		condition
	).build()

	Log.trace("pipeline", "sift by post")

	return newState
}
