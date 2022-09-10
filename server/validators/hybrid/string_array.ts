import type {
	ValidationState,
	ValidationConstraints,
	ArrayRuleConstraints
} from "!/types/validation"

import array from "!/validators/base/array"
import string from "!/validators/base/string"

/**
 * Validator to check if data is a string with comma-delimited values
 */
export default async function(
	currentState: Promise<ValidationState>,
	constraints: ValidationConstraints & Partial<ArrayRuleConstraints>
): Promise<ValidationState> {
	const state = await string(currentState, constraints)

	if (state.maySkip) return state

	const castValue = state.value as string
	state.value = castValue.split(",")

	return await array(Promise.resolve(state), constraints)
}
