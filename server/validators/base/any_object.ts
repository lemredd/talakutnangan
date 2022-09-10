import type {
	ValidationState,
	ValidationConstraints
} from "!/types/validation"

import isPlainObject from "$/helpers/is_plain_object"

/**
 * Validator to check if data is an object with any value.
 */
export default async function(
	currentState: Promise<ValidationState>,
	constraints: ValidationConstraints
): Promise<ValidationState> {
	const state = await currentState

	if (state.maySkip) return state

	if (isPlainObject(state.value)) {
		return state
	}

	const error = {
		"field": constraints.field,
		"friendlyName": constraints.friendlyName,
		"messageMaker": (field: string) => `Field "${field}" must be an object.`
	}

	throw error
}
