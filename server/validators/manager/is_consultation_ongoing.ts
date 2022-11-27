import type { Request } from "!/types/dependent"
import type { ValidationState, ValidationConstraints } from "!/types/validation"

import Manager from "%/managers/consultation"

/**
 * Validator to check if a consultation has no other consultation activated.
 *
 * Note: The validator only works for resources with numerical consultation IDs only.
 */
export default async function(
	currentState: Promise<ValidationState>,
	constraints: ValidationConstraints<Request>
): Promise<ValidationState> {
	const state = await currentState

	if (state.maySkip) return state

	const manager = new Manager(constraints.request)

	const modelID = state.value
	const canStart = await manager.canStart(Number(modelID))

	if (canStart) return state

	const error = {
		"field": constraints.field,
		"friendlyName": constraints.friendlyName,
		"messageMaker": (
			field: string,
			value: string
		) => {
			const subject = `The consultation with an ID of "${value}"`
			const predicate = "cannot be started because there are other started ones."

			return `${subject} ${predicate}`
		}
	}

	throw error
}
