import type { FindOptions, IncludeOptions } from "%/types/dependent"

import Log from "$!/singletons/log"

import Role from "%/models/role"
import User from "%/models/user"
import ChatMessage from "%/models/chat_message"
import AttachedRole from "%/models/attached_role"
import ChatMessageActivity from "%/models/chat_message_activity"

/**
 * Includes role and department models upon getting user models
 */
export default function<T>(
	currentState: FindOptions<T>,
	unusedConstraints: { [key: string]: any }
): FindOptions<T> {
	const newState = { ...currentState }

	if (typeof newState.include === "undefined") {
		newState.include = []
	}

	const castInclude = newState.include as IncludeOptions[]
	castInclude.push({
		"include": [
			{
				"model": User,
				"required": true
			},
			{
				"model": Role,
				"required": true
			}
		],
		"model": AttachedRole,
		"required": true
	}, {
		"model": User,
		"required": true
	}, {
		"include": [
			{
				"limit": 1,
				"model": ChatMessage,
				"order": [
					[ "createdAt", "DESC" ]
				],
				"required": true
			}
		],
		"model": ChatMessageActivity,
		"paranoid": false,
		"required": true
	})

	Log.trace("pipeline", "applied default includer")

	return newState
}
