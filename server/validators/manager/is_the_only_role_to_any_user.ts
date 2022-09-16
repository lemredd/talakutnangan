import type { Request } from "!/types/dependent"
import type { ValidationState, ValidationConstraints } from "!/types/validation"

import Manager from "%/managers/role"

/**
 * Validator to check if role is the only role of any user.
 *
 * Note: The validator only works for resources with numerical role IDs only.
 */
export default async function(
	currentState: Promise<ValidationState>,
	constraints: ValidationConstraints<Request>
): Promise<ValidationState> {
	const state = await currentState

	if (state.maySkip) return state

	const manager = new Manager(constraints.request)

	const modelID = state.value
	const isTheOnlyRoleToAnyUser = await manager.isTheOnlyRoleToAnyUser(modelID)

	if (isTheOnlyRoleToAnyUser) return state

	const error = {
		"field": constraints.field,
		"friendlyName": constraints.friendlyName,
		"messageMaker": (
			field: string,
			value: string
		) => {
			const subject = `The "${field}" with a value of "${value}"`
			const predicate = "should have a user which is also have other rules after deletion."

			return `${subject} ${predicate}`
		}
	}

	throw error
}
