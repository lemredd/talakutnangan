import type {
	NullableConstraints,
	ValidationState,
	ValidationConstraints
} from "!/types/independent"

/**
 * Validator to allow data to be nullable.
 *
 * If nullable, it will skip the remaining rules unless there is a default value.
 */
export default async function(
	currentState: Promise<ValidationState>,
	constraints: ValidationConstraints & NullableConstraints
): Promise<ValidationState> {
	const state = await currentState

	if(state.maySkip) return state

	if (state.value === undefined || state.value === null) {
		if (constraints.nullable === undefined) {
			state.maySkip = true
			state.value = null
		} else {
			state.value = constraints.nullable.defaultValue
		}
	}

	return state
}
