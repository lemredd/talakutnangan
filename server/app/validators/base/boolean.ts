import type { ValidationState, ValidationConstraints } from "!/types/independent"

import isBoolean from "validator/es/lib/isBoolean"
import toBoolean from "validator/es/lib/toBoolean"

/**
 * Validator to check if data is a valid boolean value.
 *
 * Accepts "true", "false", "1", or "0"
 */
export default async function(
	currentState: Promise<ValidationState>,
	constraints: ValidationConstraints
): Promise<ValidationState> {
	const state = await currentState

	if(state.maySkip) return state

	const value = state.value+""
	if (isBoolean(value)) {
		state.value = toBoolean(value)
		return state
	} else {
		throw {
			field: constraints.field,
			messageMaker: (field: string) => `Field "${field}" must be a string.`
		}
	}
}
