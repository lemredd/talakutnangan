import type { ValidationState, ValidationConstraints } from "!/types/independent"

import isString from "lodash.isstring"

/**
 * Validator to check if data is a valid string
 */
export default async function(
	currentState: Promise<ValidationState>,
	constraints: ValidationConstraints
): Promise<ValidationState> {
	const state = await currentState

	if(state.maySkip) return state

	if (isString(state.value)) {
		return state
	} else {
		throw {
			field: constraints.field,
			messageMaker: (field: string) => `Field "${field}" must be a string.`
		}
	}
}
