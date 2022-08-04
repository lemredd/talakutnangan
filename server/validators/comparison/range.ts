import type {
	ValidationState,
	ValidationConstraints,
	RuleContraints
} from "!/types/validation"

import makeDeveloperError from "!/validators/make_developer_error"

/**
 * Validator to check if the value is within the specified range.
 *
 * Comparison is inclusive. Only works if the value is guaranteed to be a number.
 */
export default async function(
	currentState: Promise<ValidationState>,
	constraints: ValidationConstraints & Partial<RuleContraints>
): Promise<ValidationState> {
	const state = await currentState

	if(state.maySkip) return state

	if (constraints.range === undefined) {
		throw makeDeveloperError(constraints.field)
	}

	const value = state.value

	if (constraints.range.minimum !== undefined && value < constraints.range.minimum) {
		throw {
			field: constraints.field,
			messageMaker: (field: string) =>
				`Field "${field}" must be more than or equal to ${constraints.range!.minimum}.`
		}
	}

	if (constraints.range.maximum !== undefined && constraints.range.maximum < value) {
		throw {
			field: constraints.field,
			messageMaker: (field: string) =>
				`Field "${field}" must be less than or equal to ${constraints.range!.maximum}.`
		}
	}

	return state
}
