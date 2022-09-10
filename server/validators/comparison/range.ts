import type {
	ValidationState,
	ValidationConstraints,
	RuleContraints
} from "!/types/validation"

import isUndefined from "$/helpers/type_guards/is_undefined"
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

	if (state.maySkip) return state

	if (isUndefined(constraints.range)) {
		throw makeDeveloperError(constraints.field)
	}

	const { value } = state

	if (!isUndefined(constraints.range.minimum) && value < constraints.range.minimum) {
		const error = {
			"field": constraints.field,
			"friendlyName": constraints.friendlyName,
			"messageMaker": (
				field: string
			) => `Field "${field}" must be more than or equal to ${constraints.range?.minimum}.`
		}

		throw error
	}

	if (!isUndefined(constraints.range.maximum) && constraints.range.maximum < value) {
		const error = {
			"field": constraints.field,
			"friendlyName": constraints.friendlyName,
			"messageMaker": (
				field: string
			) => `Field "${field}" must be less than or equal to ${constraints.range?.maximum}.`
		}

		throw error
	}

	return state
}
