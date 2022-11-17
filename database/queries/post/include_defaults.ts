import type { FindOptions, IncludeOptions } from "%/types/dependent"

import Log from "$!/singletons/log"

import Tag from "%/models/tag"
import Role from "%/models/role"
import User from "%/models/user"
import Department from "%/models/department"
import AttachedRole from "%/models/attached_role"
import isUndefined from "$/type_guards/is_undefined"
import ProfilePicture from "%/models/profile_picture"
import PostAttachment from "%/models/post_attachment"

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
				"required": true
			},
			{
				"model": Role,
				"required": true
			}
		],
		"model": AttachedRole,
		"required": true
	})
	castInclude.push({
		"model": Department,
		"required": false
	})
	castInclude.push({
		"model": PostAttachment,
		"required": false
	})
	castInclude.push({
		"model": Tag,
		"required": false
	})

	Log.trace("pipeline", "applied default includer")

	return newState
}
