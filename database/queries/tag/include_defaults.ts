import type { PostRequirementFilter } from "$/types/query"
import type { FindOptions, IncludeOptions } from "%/types/dependent"

import Log from "$!/singletons/log"

import Post from "%/models/post"

import isUndefined from "$/type_guards/is_undefined"

/**
 * Includes default models
 */
export default function<T>(
	currentState: FindOptions<T>,
	constraints: PostRequirementFilter
): FindOptions<T> {
	const newState = { ...currentState }

	if (isUndefined(newState.include)) {
		newState.include = []
	}

	const castInclude = newState.include as IncludeOptions[]
	castInclude.push({
		"model": Post,
		"required": constraints.filter.mustHavePost
	})

	Log.trace("pipeline", "applied default includer")

	return newState
}
