import type { ValidationState, ValidationConstraints } from "!/types/validation"

/**
 * Validator to check if data is a valid integer
 */
export default async function(
	currentState: Promise<ValidationState>,
	constraints: ValidationConstraints
): Promise<ValidationState> {
	const state = await currentState

	if(state.maySkip) return state

	state.value = Number(state.value)

	if (Number.isInteger(state.value)) {
		return state
	} else {
		throw {
			field: constraints.field,
			messageMaker: (field: string) => `Field "${field}" must be an integer.`
		}
	}
}
