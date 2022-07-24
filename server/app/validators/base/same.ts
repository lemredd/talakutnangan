import type {
	ValidationState,
	ValidationConstraints,
	SameRuleConstraints
} from "!/types/independent"

/**
 * Validator to check if data is the same as the data passed
 */
export default async function(
	currentState: Promise<ValidationState>,
	constraints: ValidationConstraints & SameRuleConstraints
): Promise<ValidationState> {
	const state = await currentState

	if(state.maySkip) return state

	if (state.value === constraints.same) {
		return state
	} else {
		throw {
			field: constraints.field,
			messageMaker: (field: string) => `Field "${field}" must be "${constraints.same}".`
		}
	}
}
