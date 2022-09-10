import type { ValidationState, ValidationConstraints } from "!/types/validation"

import isUndefined from "$/helpers/type_guards/is_undefined"

/**
 * Validator to require the data
 */
export default async function(
	currentState: Promise<ValidationState>,
	constraints: ValidationConstraints
): Promise<ValidationState> {
	const state = await currentState

	if (state.maySkip) return state

	if (!isUndefined(state.value) && state.value !== null) {
		return state
	}

	const error = {
		"field": constraints.field,
		"friendlyName": constraints.friendlyName,
		"messageMaker": (field: string) => `Field "${field}" is required.`
	}

	throw error
}
