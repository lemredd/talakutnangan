import type {
	ValidationState,
	ValidationConstraints,
	LengthConstraints
} from "!/types/validation"

import isUndefined from "$/helpers/type_guards/is_undefined"
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

	if (state.maySkip) return state

	if (isUndefined(constraints.length)) {
		throw makeDeveloperError(constraints.field)
	}

	const expectedSanitizeLength = state.value.length

	if (
		!isUndefined(constraints.length.minimum)
		&& expectedSanitizeLength < constraints.length.minimum
	) {
		const error = {
			"field": constraints.field,
			"friendlyName": constraints.friendlyName,
			"messageMaker": (field: string) => `Field "${field}" must be more than or equal to ${
				constraints.length?.minimum
			} character(s).`
		}

		throw error
	}

	if (
		!isUndefined(constraints.length.maximum)
		&& constraints.length.maximum < expectedSanitizeLength
	) {
		const error = {
			"field": constraints.field,
			"friendlyName": constraints.friendlyName,
			"messageMaker": (field: string) => `Field "${field}" must be less than or equal to ${
				constraints.length?.maximum
			} character(s).`
		}

		throw error
	}

	return state
}
