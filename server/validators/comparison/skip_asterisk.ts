import type { ValidationState, ValidationConstraints } from "!/types/validation"

/**
 * Validator to check if the value is an asterisk to skip other validators.
 */
export default async function(
	currentState: Promise<ValidationState>,
	unusedConstraints: ValidationConstraints
): Promise<ValidationState> {
	const state = await currentState

	if (state.maySkip) return state

	if (state.value === "*") {
		state.maySkip = true
	}

	return state
}
