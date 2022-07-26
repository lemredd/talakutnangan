import type { ValidationState, ValidationConstraints } from "!/types/independent"

/**
 * Validator to require the data
 */
export default async function(
	currentState: Promise<ValidationState>,
	constraints: ValidationConstraints
): Promise<ValidationState> {
	const state = await currentState

	if(state.maySkip) return state

	if (state.value !== undefined && state.value !== null) {
		return state
	} else {
		throw {
			field: constraints.field,
			messageMaker: (field: string) => `Field "${field}" is required.`
		}
	}
}
