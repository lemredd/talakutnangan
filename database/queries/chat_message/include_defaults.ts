import type { FindOptions, IncludeOptions } from "%/types/dependent"

import User from "%/models/user"
import Log from "$!/singletons/log"
import isUndefined from "$/type_guards/is_undefined"
import ProfilePicture from "%/models/profile_picture"
import AttachedChatFile from "%/models/attached_chat_file"
import ChatMessageActivity from "%/models/chat_message_activity"

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
		"include": [
			{
				"include": [
					{
						"model": ProfilePicture,
						"required": false
					}
				],
				"model": User,
				"paranoid": false,
				"required": true
			}
		],
		"model": ChatMessageActivity,
		"paranoid": false,
		"required": true
	})
	castInclude.push({
		"model": AttachedChatFile,
		"required": false
	})

	Log.trace("query pipe", "applied default includer")

	return newState
}
