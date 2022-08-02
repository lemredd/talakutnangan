import type {
	ValidationState,
	ValidationConstraints,
	LengthConstraints
} from "!/types/validation"

import makeDeveloperError from "!/validators/make_developer_error"

/**
 * Validator to check if the value is within the specific length.
 *
 * Comparison is inclusive. Only works if the value is guaranteed to be string or array.
 */
export default async function(
	currentState: Promise<ValidationState>,
	constraints: ValidationConstraints & Partial<LengthConstraints>
): Promise<ValidationState> {
	const state = await currentState

	if(state.maySkip) return state

	if (constraints.length === undefined) {
		throw makeDeveloperError(constraints.field)
	}

	const expectedSanitizeLength = state.value.length

	if (
		constraints.length.minimum !== undefined
		&& expectedSanitizeLength < constraints.length.minimum) {
		throw {
			field: constraints.field,
			messageMaker: (field: string) =>
				`Field "${field}" must be more than or equal to ${
					constraints.length!.minimum
				} character(s).`
		}
	}

	if (
		constraints.length.maximum !== undefined
		&& constraints.length.maximum < expectedSanitizeLength) {
		throw {
			field: constraints.field,
			messageMaker: (field: string) =>
				`Field "${field}" must be less than or equal to ${
					constraints.length!.maximum
				} character(s).`
		}
	}

	return state
}
