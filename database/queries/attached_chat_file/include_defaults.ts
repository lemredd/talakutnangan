import type { FindOptions, IncludeOptions } from "%/types/dependent"

import Log from "$!/singletons/log"
import ChatMessage from "%/models/chat_message"
import isUndefined from "$/type_guards/is_undefined"

/**
 * Includes default models
 */
export default function<T>(
	currentState: FindOptions<T>,
	unusedConstraints: { [key: string]: any }
): FindOptions<T> {
	const newState = { ...currentState }

	if (isUndefined(newState.include)) {
		newState.include = []
	}

	const castInclude = newState.include as IncludeOptions[]
	castInclude.push({
		"model": ChatMessage,
		"required": true
	})

	Log.trace("query pipe", "applied default includer")

	return newState
}
