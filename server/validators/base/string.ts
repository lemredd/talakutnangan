import type { ValidationState, ValidationConstraints } from "!/types/validation"

import isString from "lodash.isstring"

/**
 * Validator to check if data is a valid string
 */
export default async function(
	currentState: Promise<ValidationState>,
	constraints: ValidationConstraints
): Promise<ValidationState> {
	const state = await currentState

	if (state.maySkip) return state

	if (isString(state.value)) {
		return state
	}

	const error = {
		"field": constraints.field,
		"friendlyName": constraints.friendlyName,
		"messageMaker": (field: string) => `Field "${field}" must be a string.`
	}

	throw error
}
