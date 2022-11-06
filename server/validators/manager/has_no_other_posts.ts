import type { Request } from "!/types/dependent"
import type { ValidationState, ValidationConstraints } from "!/types/validation"

import Manager from "%/managers/tag"

/**
 * Validator to check if a tag has no other tag activated.
 *
 * Note: The validator only works for resources with numerical tag IDs only.
 */
export default async function(
	currentState: Promise<ValidationState>,
	constraints: ValidationConstraints<Request>
): Promise<ValidationState> {
	const state = await currentState

	if (state.maySkip) return state

	const manager = new Manager(constraints.request)

	const modelID = state.value
	const hasPosts = await manager.findWithID(Number(modelID), {
		"constraints": {
			"filter": {
				"existence": "exists",
				"mustHavePost": true
			}
		}
	})

	if (hasPosts) return state

	const error = {
		"field": constraints.field,
		"friendlyName": constraints.friendlyName,
		"messageMaker": (
			field: string,
			value: string
		) => {
			const subject = `The tag with an ID of "${value}"`
			const predicate = "must be unused by any posts."

			return `${subject} ${predicate}`
		}
	}

	throw error
}
